import { findUserByID } from "../utils/users";
import { CustomError } from "../middlewares/errorHandler";
import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getAuthorizedUserID } from "../utils/auth";

export const UserAuthenticated = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  // If we've got to this point, the user exists and is authorized
  const userID = getAuthorizedUserID(req) as number;

  try {
    const user = await findUserByID(userID);

    if (!user) {
      return next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error!"));
    }

    res.json(user);
    next();
  } catch (err) {
    return next(err);
  }
};
