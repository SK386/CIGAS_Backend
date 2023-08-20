import type prismaclient from "@prisma/client";
import validator from "validator";
import { CustomError } from "./middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";

export type validationUser = Omit<prismaclient.Person, "id" | "role"> & {
  confirmpassword: string
};

export interface LoginUser {
  email: string
  password: string
}

export function isValidLoginUser(User: LoginUser): CustomError | undefined {
  if (!User.email) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
  }

  if (!User.password) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
  }
}

export function isValidNewUser(User: validationUser): CustomError | undefined {
  if (!User.FirstName) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a first name!");
  }

  if (!User.LastName) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a last name!");
  }

  if (!User.email) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
  } else if (!validator.isEmail(User.email)) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!");
  }

  // Phone number is not mandatory
  if (User.phone && !validator.isMobilePhone(User.phone, ["pt-BR"])) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!");
  }

  if (!User.password) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
  }

  if (!User.confirmpassword) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a to confirm your password!");
  }

  if (User.password !== User.confirmpassword) {
    return new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "The passwords don't match!");
  }
}
