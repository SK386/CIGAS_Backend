import { type Request, type NextFunction, type Response } from "express";
import { CustomError } from "./errorHandler";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { getAuthorizedUserID } from "../utils/auth";
import { findUserByID } from "../utils/users";

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new CustomError(StatusCodes.FORBIDDEN, "Access denied!");
    }

    const SECRET_KEY: jwt.Secret = process.env.SECRET ?? "";
    if (!SECRET_KEY) { throw new Error("SECRET_KEY Is empty when it shouldn't be!"); }

    jwt.verify(token, SECRET_KEY);

    const userID = getAuthorizedUserID(req) as number;

    // It's not likely to happen but a token can be valid while the user doesn't exist anymore
    const user = await findUserByID(userID);
    if (!user) {
      return next(new CustomError(StatusCodes.NOT_FOUND, "Invalid token! User does not exist!"));
    }

    next();
  } catch (err) {
    next(err);
  }
}
