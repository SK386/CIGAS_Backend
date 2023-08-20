import { type Request, type NextFunction, type Response } from "express";
import { CustomError } from "./errorHandler";
import { StatusCodes } from "http-status-codes";
import { type Secret, verify } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new CustomError(StatusCodes.FORBIDDEN, "Access denied!");
    }

    const SECRET_KEY: Secret = process.env.SECRET ?? "";
    if (!SECRET_KEY) { throw new Error("SECRET_KEY Is empty when it shouldn't be!"); }

    verify(token, SECRET_KEY);

    next();
  } catch (err) {
    next(err);
  }
}
