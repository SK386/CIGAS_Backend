import { Router } from "express";
import { UserAuthenticated } from "../controllers/user.controller";

const router = Router();

router.get("/", UserAuthenticated);

export default router;
