import { UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import HttpException from "../models/http-exception.model";
import { type LoginInput } from "../models/login-input.model";
import { type RegisterInput } from "../models/register-input.model";

export function isValidLoginUser(User: LoginInput): HttpException | undefined {
  if (!User.email) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
  }

  if (!User.password) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
  }
}

export const isValidNewUser = (User: RegisterInput): HttpException | undefined => {
  if (!User.FirstName) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a first name!");
  }

  if (!User.LastName) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a last name!");
  }

  if (!User.email) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
  } else if (!validator.isEmail(User.email)) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!");
  }

  // Phone number is not mandatory
  if (User.phone && !validator.isMobilePhone(User.phone)) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!");
  }

  if (!User.password) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
  }

  if (!User.role || (User.role !== UserRole.STUDENT && User.role !== UserRole.TEACHER)) {
    return new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, "You need a valid role! It can be either STUDENT or TEACHER.");
  }
};
