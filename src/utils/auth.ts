import { type Request } from "express";
import { type JwtPayload, decode } from "jsonwebtoken";
/*
 * Should only be used on authorized routes as the auth middleware tests
 * whether the token is valid or not.
 */
export function getAuthorizedUserID(req: Request): number | undefined {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (token) {
    const decodedToken = decode(token) as JwtPayload;
    return decodedToken.id;
  }
}
