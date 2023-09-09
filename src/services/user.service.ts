import { type User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import HttpException from "../models/http-exception.model";

export const FindUserByEmail = async(email: string, password: boolean): Promise<Partial<User> | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
      FirstName: true,
      LastName: true,
      email: true,
      phone: true,
      role: true,
      password
    }
  });

  if (user) {
    return user;
  } else {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found!");
  }
};

export const FindUserById = async(id: number, password: boolean): Promise<Partial<User> | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      FirstName: true,
      LastName: true,
      email: true,
      phone: true,
      role: true,
      password
    }
  });

  if (user) {
    return user;
  } else {
    throw new HttpException(StatusCodes.NOT_FOUND, "User not found!");
  }
};
