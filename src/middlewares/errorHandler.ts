import { type NextFunction, type Request, type Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class CustomError extends Error {
  constructor(public statusCode: number, public message: string) {
    super();
  }
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMsg = err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: statusCode,
    msg: errorMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {}
  });
};
