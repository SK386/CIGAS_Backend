import { AuthRoute, UserRoute, UsersRoute } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import options from "./swaggerOptions";
import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Application middlewares
app.use("/auth", AuthRoute);
app.use("/user", authMiddleware, UserRoute);
app.use("/users", authMiddleware, UsersRoute);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

export default app;
