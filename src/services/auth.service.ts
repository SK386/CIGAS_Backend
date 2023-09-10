import { type User } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import HttpException from "../models/http-exception.model";
import { type LoginInput } from "../models/login-input.model";
import { type RegisterInput } from "../models/register-input.model";
import { type RegisteredUser } from "../models/registered-user.model";
import { isValidLoginUser, isValidNewUser } from "../utils/auth";
import { generateToken } from "../utils/token.utils";
import { FindUserByEmail } from "./user.service";

export const sixtyDaysInSeconds = 60 * 24 * 60 * 60 * 1000;

const checkUserUniqueness = async(email: string): Promise<undefined> => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existingUserByEmail) {
    throw new HttpException(StatusCodes.CONFLICT, "User already exists!");
  }
};

export const createUser = async(input: RegisterInput): Promise<RegisteredUser> => {
  const invalidUser = isValidNewUser(input);

  if (invalidUser) {
    throw invalidUser;
  }

  await checkUserUniqueness(input.email);

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  const user = await prisma.user.create({
    data: {
      FirstName: input.FirstName,
      LastName: input.LastName,
      email: input.email,
      password: hashedPassword,
      phone: input.phone ?? undefined,
      role: input.role
    },
    select: {
      FirstName: true,
      LastName: true,
      email: true,
      phone: true,
      role: true
    }
  });
  return user;
};

export const login = async(userPayload: LoginInput): Promise<Partial<User> & { token: string } | undefined> => {
  const invalidUser = isValidLoginUser(userPayload);

  if (invalidUser) {
    throw invalidUser;
  }

  const user = await FindUserByEmail(userPayload.email, true);
  if (user) {
    const match = await bcrypt.compare(userPayload.password, String(user.password));

    if (match) {
      const { password: _, ...userNoPass } = user;
      return {
        ...userNoPass,
        token: generateToken(user)
      };
    }
  }
};
