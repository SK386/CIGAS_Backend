import { type Article } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import { type ArticleInput } from "../models/article-input.model";
import HttpException from "../models/http-exception.model";
import { findSchoolById } from "./school.service";

// Create
export const createArticle = async(articleInput: ArticleInput): Promise<Article | undefined> => {
  // Ensure school exists
  await findSchoolById(articleInput.schoolId);

  const article = await prisma.article.create({
    data: articleInput
  });
  return article;
};
// Read
export const findArticleById = async(articleId: number): Promise<Article | undefined> => {
  const article = await prisma.article.findUnique({
    where: {
      id: articleId
    }
  });
  if (article) {
    return article;
  }
  throw new HttpException(StatusCodes.NOT_FOUND, "Article not found!");
};

export const listArticlesFromSchool = async(schoolId: number): Promise<Article[] | undefined> => {
  const articles = await prisma.article.findMany({
    where: {
      schoolId
    }
  });
  return articles;
};
// Update
// Delete
