import { type NextFunction, type Request, type Response, Router } from "express";
import authMiddleware from "../middleware/authentication.middleware";
import { createSchool, deleteSchool, findSchoolById, listSchools, updateSchool } from "../services/school.service";

const router = Router();
// Create
router.post("/school", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const school = await createSchool(req.body.school.name);

    res.json({ school });
  } catch (error) {
    next(error);
  }
});

// Read
router.get("/schools", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const schools = await listSchools();

    res.json({ schools });
  } catch (error) {
    next(error);
  }
});

router.get("/school/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const school = await findSchoolById(parseInt(id));

    res.json({ school });
  } catch (error) {
    next(error);
  }
});

router.patch("/school/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body.school;
    const school = await updateSchool(parseInt(id), name);
    res.json({ school });
  } catch (error) {
    next(error);
  }
});

router.delete("/school/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await deleteSchool(parseInt(id));
    res.json({ status: 200, message: "School deleted!" });
  } catch (error) {
    next(error);
  }
});

export default router;
