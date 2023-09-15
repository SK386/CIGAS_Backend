"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listArticlesFromSchool = exports.findArticleById = exports.createArticle = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const school_service_1 = require("./school.service");
const user_service_1 = require("./user.service");
// Create
const createArticle = async (articleInput) => {
    // Ensure school exists
    await (0, school_service_1.findSchoolById)(articleInput.schoolId);
    const article = await prisma_client_1.default.article.create({
        data: articleInput
    });
    return article;
};
exports.createArticle = createArticle;
// Read
const findArticleById = async (articleId) => {
    const article = await prisma_client_1.default.article.findUnique({
        where: {
            id: articleId
        },
        include: {
            Teacher: true
        }
    });
    if (article) {
        const user = await (0, user_service_1.FindUserById)(article.Teacher.user_id, false);
        const authorName = `${user?.FirstName} ${user?.LastName}`;
        const articleWithAuthor = {
            ...article,
            author: authorName
        };
        const { Teacher: _, ...articleWithAuthorNoTeacher } = articleWithAuthor;
        return articleWithAuthorNoTeacher;
    }
    throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Article not found!");
};
exports.findArticleById = findArticleById;
const listArticlesFromSchool = async (schoolId) => {
    const articlesWithAuthors = [];
    const articles = await prisma_client_1.default.article.findMany({
        where: {
            schoolId
        },
        include: {
            Teacher: true
        }
    });
    for (const article of articles) {
        const user = await (0, user_service_1.FindUserById)(article.Teacher.user_id, false);
        const authorName = `${user?.FirstName} ${user?.LastName}`;
        const articleWithAuthor = {
            author: authorName,
            ...article
        };
        const { Teacher: _, ...articleWithAuthorsNoTeacher } = articleWithAuthor;
        articlesWithAuthors.push(articleWithAuthorsNoTeacher);
    }
    return articlesWithAuthors;
};
exports.listArticlesFromSchool = listArticlesFromSchool;
// Update
// Delete
//# sourceMappingURL=article.service.js.map