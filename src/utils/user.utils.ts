import { type User, UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import HttpException from "../models/http-exception.model";

export const validateUserPatch = (user: Partial<User>): undefined => {
  if (user.email && !validator.isEmail(user.email)) {
    throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!");
  }

  // Phone number is not mandatory
  if (user.phone && !validator.isMobilePhone(user.phone)) {
    throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!");
  }

  if (user.role && user.role !== UserRole.STUDENT && user.role !== UserRole.TEACHER) {
    throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a valid role! It can be either STUDENT or TEACHER.");
  }
};
