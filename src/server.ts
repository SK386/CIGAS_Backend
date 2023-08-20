import swaggerFile from "../swagger.json";
import swaggerUI from "swagger-ui-express";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { AuthRoute, UsersRoute } from "./routes";
import "dotenv/config";
import { authMiddleware } from "./middlewares/auth";
const app = express();

app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Application middlewares
app.use("/auth", AuthRoute);
app.use("/users", authMiddleware, UsersRoute);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

export default app;
