import { type NextFunction, type Request, type Response } from "express";
import { type LoginUser, isValidLoginUser, isValidNewUser, type validationUser } from "../validations";
import { CustomError } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";
import { type Secret, sign } from "jsonwebtoken";
import { createUser, findUserByEmail } from "../utils/users";

const SECRET_KEY: Secret = process.env.SECRET ?? "";

export const signUp = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const User: validationUser = req.body;

  const invalidUser = isValidNewUser(User);

  if (invalidUser) {
    return next(invalidUser);
  }

  try {
    const userExists = await findUserByEmail(User.email);

    if (userExists) {
      throw new CustomError(StatusCodes.CONFLICT, "User already exists!");
    }

    const newUser = await createUser(User);

    if (newUser instanceof Error) {
      throw newUser;
    }
    res.json(newUser);
    next();
  } catch (error) {
    return next(error);
  }
};

export const login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const login: LoginUser = req.body;

  const invalidLogin = isValidLoginUser(login);

  if (invalidLogin) {
    return next(invalidLogin);
  }

  // The user should exist...
  const user = await findUserByEmail(login.email);

  if (!user) {
    return next(new CustomError(StatusCodes.NOT_FOUND, "User not found!"));
  }

  const checkPassword = await compare(login.password, String(user?.password));

  if (!checkPassword) {
    return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid password!"));
  }

  try {
    if (!SECRET_KEY) {
      console.error("SECRET_KEY shouldn't be empty!");
      return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error!"));
    }

    const token = sign({
      id: user?.id
    }, SECRET_KEY);
    res.status(StatusCodes.OK).json({ msg: "Authenticated!", token });
  } catch (error) {
    next(error);
  }
};
