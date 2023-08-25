import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { findUserByID } from "../utils/users";

export const UserByID = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userID = parseInt(req.params.userID);
    if (isNaN(userID)) {
      return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "userID is supposed to be a number!"));
    }

    const user = await findUserByID(userID);

    if (!user) {
      return next(new CustomError(StatusCodes.NOT_FOUND, "User not found!"));
    }
    res.json(user);
  } catch (error) {
    return next(error);
  }
};