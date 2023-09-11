import { type User } from "@prisma/client";
import { type NextFunction, type Request, type Response, Router } from "express";
import authMiddleware from "../middleware/authentication.middleware";
import { FindUserById, deleteUser, searchUser, updateUser } from "../services/user.service";
import { findUserIdByToken } from "../utils/token.utils";

const router = Router();

router.post("/users/search", authMiddleware, async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // TODO: Search by Id isn't working
    const users = await searchUser(req.body.q, parseInt(req.body.id));
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

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
router.patch("/user", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.userToken;
    const userID = await findUserIdByToken(token) as number;

    const updatedUser = await updateUser(userID, req.body.user) as User;

    const { password, ...userNoPass } = updatedUser;
    res.json(userNoPass);
  } catch (error) {
    next(error);
  }
});

router.delete("/user", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.userToken;
    const userID = await findUserIdByToken(token) as number;

    await deleteUser(userID);
    res.clearCookie("userToken");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
