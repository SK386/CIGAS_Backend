import swaggerFile from "../swagger.json";
import swaggerUI from "swagger-ui-express";
import express, { type Request, type Response } from "express";
import "dotenv/config";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import { AuthRoute } from "./routes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Application middlewares
app.use("/auth", AuthRoute);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${String(port)}`);
});

export default prisma;
