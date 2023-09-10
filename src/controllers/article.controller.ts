import { Router, type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import authMiddleware from "../middleware/authentication.middleware";
import HttpException from "../models/http-exception.model";
import {
  createArticle,
  findArticleById,
  /*updateArticle,
  deleteArticle,*/
  listArticlesFromSchool
} from "../services/article.service"; // Import the article service functions
import { findTeacherIdByUserId } from "../services/teacher.service";
import { findUserIdByToken } from "../utils/token.utils";

const router = Router();

// Create an article
router.post("/article", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { schoolId, title, content } = req.body.article;

    const missingFields = [];
    if (!schoolId) missingFields.push("schoolId");
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");

    if (missingFields.length > 0) {
      throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, `Missing fields: ${missingFields.join(", ")}`);
    }

    const userId = await findUserIdByToken(req.cookies.userToken) as number;
    const authorId = await findTeacherIdByUserId(userId) as number;

    const article = await createArticle({ authorId, schoolId, title, content });
    res.status(StatusCodes.CREATED).json({ article });
  } catch (error) {
    next(error);
  }
});

// Read an article by ID
router.get("/article/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const article = await findArticleById(articleId);

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// Read all articles from a school
router.get("/articles/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const articles = await listArticlesFromSchool(parseInt(id));
    res.json(articles);
  } catch (error) {
    next(error);
  }
});
/*
// Update an article
router.put("/article/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const { authorId, schoolId, title, content } = req.body;
    const newData = { authorId, schoolId, title, content };
    const updatedArticle = await updateArticle(articleId, newData);
    if (!updatedArticle) {
      res.status(404).json({ message: "Article not found" });
    } else {
      res.json(updatedArticle);
    }
  } catch (error) {
    next(error);
  }
});

// Delete an article
router.delete("/article/:id", authMiddleware, async(req: Request, res: Response, next: NextFunction) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const deletedArticle = await deleteArticle(articleId);
    if (!deletedArticle) {
      res.status(404).json({ message: "Article not found" });
    } else {
      res.status(204).end(); // No content, as the article was successfully deleted
    }
  } catch (error) {
    next(error);
  }
});*/

export default router;
