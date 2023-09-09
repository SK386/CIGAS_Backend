import { type NextFunction, type Request, type Response, Router } from "express";
import { createUser, login, sixtyDaysInSeconds } from "../services/auth.service";

const router = Router();

router.post("/users", async(req: Request, res: Response, next: NextFunction): Promise<undefined> => {
  try {
    const user = await createUser(req.body.user);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.post("/users/login", async(req: Request, res: Response, next: NextFunction): Promise<undefined> => {
  try {
    const user = await login(req.body.user);

    res.cookie("userToken", user?.token, {
      maxAge: sixtyDaysInSeconds,
      httpOnly: true,
      secure: Boolean(process.env.COOKIE_SECURE) ?? false
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
