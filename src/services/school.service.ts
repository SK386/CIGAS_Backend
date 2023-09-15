import { type School } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import HttpException from "../models/http-exception.model";
import { FindUserById } from "./user.service";

// Create
export const createSchool = async(name: string): Promise<School | undefined> => {
  const existingSchool = await prisma.school.findUnique({
    where: {
      name
    }
  });
  if (existingSchool) {
    throw new HttpException(StatusCodes.CONFLICT, "School already exists!");
  }

  const school = await prisma.school.create({
    data: {
      name
    }
  });

  return school;
};
// Read
export const listSchools = async(): Promise<School[] | undefined> => {
  return await prisma.school.findMany({});
};

export const findSchoolById = async(id: number): Promise<School | undefined> => {
  const school = await prisma.school.findUnique({
    where: {
      id
    }
  });
  if (school) {
    return school;
  }
  throw new HttpException(StatusCodes.NOT_FOUND, "School does not exist!");
};

export const findSchoolsByUserId = async(id: number): Promise<School[] | undefined> => {
// Use Prisma to find the user by their ID
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return undefined;
  }

  // Find schools associated with the user through the Student and Teacher models
  const studentSchools = await prisma.student.findMany({
    where: { user_id: id },
    include: {
      School: true
    }
  });

  const teacherSchools = await prisma.teacher.findMany({
    where: { user_id: id },
    include: {
      School: true
    }
  });

  // Combine the schools from both student and teacher associations
  const schools = [
    ...studentSchools.map((student) => student.School),
    ...teacherSchools.map((teacher) => teacher.School)
  ];

  return schools;
};

// Update
export const updateSchool = async(id: number, name: string): Promise <School | undefined> => {
  // Check if the school exists
  await findSchoolById(id);
  const updatedSchool = await prisma.school.update({
    where: {
      id
    },
    data: {
      name
    }
  });

  return updatedSchool;
};
// Delete
export const deleteSchool = async(id: number): Promise<undefined> => {
  // Check if the school exists
  await findSchoolById(id);
  await prisma.school.delete({
    where: {
      id
    }
  });
};
