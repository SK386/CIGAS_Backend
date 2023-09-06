import { AuthRoute, UserRoute, UsersRoute } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/auth";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import options from "./swaggerOptions";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Token in cookie
  methods: "GET,PUT,POST,DELETE,OPTIONS"
}));
app.use(helmet());
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
