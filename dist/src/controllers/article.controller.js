"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const article_service_1 = require("../services/article.service"); // Import the article service functions
const teacher_service_1 = require("../services/teacher.service");
const token_utils_1 = require("../utils/token.utils");
const router = (0, express_1.Router)();
// Create an article
router.post("/article", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const { schoolId, title, content } = req.body.article;
        const missingFields = [];
        if (!schoolId)
            missingFields.push("schoolId");
        if (!title)
            missingFields.push("title");
        if (!content)
            missingFields.push("content");
        if (missingFields.length > 0) {
            throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, `Missing fields: ${missingFields.join(", ")}`);
        }
        const userId = await (0, token_utils_1.findUserIdByToken)(req.cookies.userToken);
        const authorId = await (0, teacher_service_1.findTeacherIdByUserId)(userId);
        const article = await (0, article_service_1.createArticle)({ authorId, schoolId, title, content });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ article });
    }
    catch (error) {
        next(error);
    }
});
// Read an article by ID
router.get("/article/:id", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const articleId = parseInt(req.params.id, 10);
        const article = await (0, article_service_1.findArticleById)(articleId);
        res.json(article);
    }
    catch (error) {
        next(error);
    }
});
// Read all articles from a school
router.get("/articles/:id", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const { id } = req.params;
        const articles = await (0, article_service_1.listArticlesFromSchool)(parseInt(id));
        res.json(articles);
    }
    catch (error) {
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
exports.default = router;
//# sourceMappingURL=article.controller.js.map