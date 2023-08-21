import { Router } from "express";
import { UserByID } from "../controllers/users.controller";

const router = Router();

router.get("/:userID", UserByID);

export default router;
