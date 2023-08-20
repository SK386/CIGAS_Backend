import swaggerFile from "../swagger.json";
import swaggerUI from "swagger-ui-express";
import express, { type Request, type Response } from "express";
import "dotenv/config";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import { AuthRoute } from "./routes";

const app = express();

app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Application middlewares
app.use("/auth", AuthRoute);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

export default app;
