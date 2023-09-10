import { type User } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import HttpException from "../models/http-exception.model";
import { validateUserPatch } from "../utils/user.utils";

export const searchUser = async(q: string, uuid: number): Promise<Array<Partial<User>>> => {
  const baseQuery = {
    OR: [
      {
        FirstName: {
          contains: q
        }
      },
      {
        LastName: {
          contains: q
        }
      }
    ]
  };

  const query = uuid ? { ...baseQuery, id: uuid } : baseQuery;

  const users = await prisma.user.findMany({
    where: query
  });

  const usersNoPass = users.map(({ password, phone, ...user }) => user);

  return usersNoPass;
};

export const updateUser = async(id: number, updatedUserData: Partial<User>): Promise<User | undefined> => {
  try {
    await FindUserById(id, false);

    validateUserPatch(updatedUserData);

    // Check if a new password is provided in updatedUserData
    if (updatedUserData.password) {
      // Hash the new password using bcrypt
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(updatedUserData.password, salt);

      // Update the password with the hashed password
      updatedUserData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id
      },
      data: updatedUserData
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    console.log(error);
    throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error, try again later!");
  }
};

export const deleteUser = async(id: number): Promise<undefined> => {
  try {
    await prisma.user.delete({
      where: {
        id
      }
    });
  } catch (error) {
    console.log(error);
    throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error, try again later!");
  }
};

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
