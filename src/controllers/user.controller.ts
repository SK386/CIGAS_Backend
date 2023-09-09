import { type NextFunction, type Request, type Response, Router } from "express";
import authMiddleware from "../middleware/authentication.middleware";
import { FindUserById } from "../services/user.service";
import { findUserIdByToken } from "../utils/token.utils";

const router = Router();

router.get("/user", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.userToken;
    const userID = await findUserIdByToken(token) as number;

    const user = await FindUserById(userID, false);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
