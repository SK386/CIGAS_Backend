import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "process";

export function tokenMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(StatusCodes.FORBIDDEN).json({error: ReasonPhrases.FORBIDDEN, msg: "Access Denied!"});
    }

    try {
        const secret = env.SECRET;
        jwt.verify(token, secret);

        next();
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error: ReasonPhrases.BAD_REQUEST, msg: "Invalid token!"});
    }
}