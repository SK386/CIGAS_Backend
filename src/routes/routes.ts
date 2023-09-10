import { Router } from "express";
import articleController from "../controllers/article.controller";
import authController from "../controllers/auth.controller";
import schoolController from "../controllers/school.controller";
import teacherController from "../controllers/teacher.controller";
import userController from "../controllers/user.controller";

const api = Router()
  .use(authController)
  .use(schoolController)
  .use(teacherController)
  .use(articleController)
  .use(userController);

export default Router().use("/api", api);
