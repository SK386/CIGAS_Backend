import { type User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import HttpException from "../models/http-exception.model";
import { FindUserById } from "../services/user.service";

export const generateToken = (user: Partial<User>): string => {
  return jwt.sign({ id: user.id }, process.env.SECRET ?? "superSecret", { expiresIn: "60d" });
};

export const findUserIdByToken = async(token: string): Promise<number | undefined> => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET ?? "superSecret") as JwtPayload;

    // We're not interested in handling the user but rather, in finding out if the user exists.
    await FindUserById(decoded.id, false);

    return Number(decoded.id);
  } catch (err) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Token is not valid!");
  }
};
