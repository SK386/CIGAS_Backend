import { type NextFunction, type Request, type Response } from "express";
import { isValidNewUser, type validationUser } from "../validations";
import prisma from "..";
import { CustomError } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { genSalt, hash, compare } from "bcrypt";
import { type Secret, sign } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.SECRET ?? "";

export const signUp = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  // #swagger.tags = ['Authorization']
  // #swagger.summary = "Create a new user."
  /* #swagger.responses[200] = {
    schema: { $ref: '#/definitions/User' }
  } */
  const { FirstName, LastName, email, phone, password, confirmpassword } = req.body;

  const User: validationUser = {
    FirstName,
    LastName,
    email,
    phone,
    password,
    confirmPassword: confirmpassword
  };

  const validUser = isValidNewUser(User);

  if (validUser) {
    return next(validUser);
  }

  const existingUser = await prisma.person.findUnique({
    where: {
      email
    }
  });

  if (existingUser) {
    return next(new CustomError(StatusCodes.CONFLICT, "user already exists"));
  }

  const salt = await genSalt(12);
  const passwordHash = await hash(password, salt);

  try {
    const newUser = await prisma.person.create({
      data: {
        FirstName,
        LastName,
        email,
        phone,
        password: passwordHash,
        role: "Hardcoded"
      }
    });
    const { password: _, ...newUserObj } = newUser;
    res.json({ user: newUserObj });
    next();
  } catch (error) {
    next(error);
  }
};

export const login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email) {
    next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!"));
  }

  if (!password) {
    next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!"));
  }

  // The user should exist...
  const user = await prisma.person.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    next(new CustomError(StatusCodes.NOT_FOUND, "User not found!"));
  }

  const checkPassword = await compare(password, String(user?.password));

  if (!checkPassword) {
    next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Invalid password!"));

    try {
      if (SECRET_KEY) {
        console.error("SECRET_KEY shouldn't be empty!");
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error!"));
      }

      const token = sign({
        id: user?.id
      }, SECRET_KEY);
      res.status(StatusCodes.OK).json({ msg: "Authenticated!", token });
    } catch (error) {
      next(error);
    }
  }
};
