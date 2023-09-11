import { type Article } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma/prisma-client";
import { type ArticleInput } from "../models/article-input.model";
import HttpException from "../models/http-exception.model";
import { findSchoolById } from "./school.service";
import { FindUserById } from "./user.service";

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
export const findArticleById = async(articleId: number): Promise<Article & { author: string } | undefined> => {
  const article = await prisma.article.findUnique({
    where: {
      id: articleId
    },
    include: {
      Teacher: true
    }
  });
  if (article) {
    const user = await FindUserById(article.Teacher.user_id, false);

    const authorName = `${user?.FirstName} ${user?.LastName}`;

    const articleWithAuthor = {
      ...article,
      author: authorName
    };

    const { Teacher: _, ...articleWithAuthorNoTeacher } = articleWithAuthor;
    return articleWithAuthorNoTeacher;
  }
  throw new HttpException(StatusCodes.NOT_FOUND, "Article not found!");
};

export const listArticlesFromSchool = async(schoolId: number): Promise<Array<Article & { author: string }> | undefined> => {
  const articlesWithAuthors = [];
  const articles = await prisma.article.findMany({
    where: {
      schoolId
    },
    include: {
      Teacher: true
    }
  });

  for (const article of articles) {
    const user = await FindUserById(article.Teacher.user_id, false);

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
// Update
// Delete
