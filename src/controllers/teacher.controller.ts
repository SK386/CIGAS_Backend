import { type NextFunction, type Request, type Response, Router } from "express";
import authMiddleware from "../middleware/authentication.middleware";
import { createTeacher, listTeachersInSchool } from "../services/teacher.service";
import { findUserIdByToken } from "../utils/token.utils";

const router = Router();

// Create
router.post("/teacher", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.body.teacher.schoolId;
    const userId = await findUserIdByToken(req.cookies.userToken) as number;

    const teacher = await createTeacher(userId, schoolId);
    res.json({ teacher });
  } catch (error) {
    next(error);
  }
});
// Read
router.get("/teachers", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const schoolId = req.body.teachers.schoolId;

    const teachers = await listTeachersInSchool(schoolId);
    res.json({ teachers });
  } catch (error) {
    next(error);
  }
});
// Update
// Delete

export default router;
