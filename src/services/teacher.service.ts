import { type Teacher } from "@prisma/client";
import prisma from "../../prisma/prisma-client";
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
