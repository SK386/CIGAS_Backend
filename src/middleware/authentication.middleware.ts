import { type NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import HttpException from "../models/http-exception.model";
import { findUserIdByToken } from "../utils/token.utils";

const authMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.userToken as string;

    if (!token) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, "Token is missing! Access Denied!");
    }

    jwt.verify(token, process.env.SECRET ?? "superSecret");

    // It's not likely to happen but a token can be valid while the user doesn't exist anymore
    await findUserIdByToken(token);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default authMiddleware;
