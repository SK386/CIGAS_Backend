import { type User, type Teacher } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import HttpException from "../models/http-exception.model";
import { findSchoolById } from "./school.service";
import { FindUserById } from "./user.service";

// Create
export const createTeacher = async(userId: number, schoolId: number): Promise<Teacher | undefined> => {
  // Ensure that the school exists:
  await findSchoolById(schoolId);

  const teacher: Teacher = await prisma.teacher.create({
    data: {
      user_id: userId,
      school_id: schoolId
    }
  });
  return teacher;
};
// Read
export const listTeachersInSchool = async(schoolId: number): Promise<Teacher[] | undefined> => {
  // Ensure that the school exists:
  await findSchoolById(schoolId);

  const teachers: Teacher[] = await prisma.teacher.findMany({
    where: {
      school_id: schoolId
    }
  });

  return teachers;
};

export const findTeacherById = async(teacherId: number): Promise<Teacher | undefined> => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId
    }
  });
  if (teacher) {
    return teacher;
  } else {
    throw new HttpException(StatusCodes.NOT_FOUND, "Teacher not found!");
  }
};

export const findUserByTeacherId = async(teacherId: number): Promise<Partial<User> | undefined> => {
  const teacher = await findTeacherById(teacherId) as Teacher;

  const user = await FindUserById(teacher?.user_id, false);

  return user;
};

export const findTeacherIdByUserId = async(userId: number): Promise<number | undefined> => {
  await FindUserById(userId, false);

  const teacherId = await prisma.teacher.findUnique({
    where: {
      user_id: userId
    },
    select: {
      id: true
    }
  });
  return teacherId?.id;
};
// Update
// Delete
