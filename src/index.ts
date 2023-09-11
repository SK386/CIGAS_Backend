import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import type HttpException from "./models/http-exception.model";
import "dotenv/config";
import routes from "./routes/routes";

const app = express();

/**
 * App configuration
 */

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Token in cookie
  methods: "GET,PUT,POST,DELETE,OPTIONS"
}));
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));
// Parse Cookie header and populate req.cookies
app.use(cookieParser());
// Improve security
app.use(helmet());
// All app routes
app.use(routes);
/**
 * Documentation
 */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api-docs", (req, res) => {
  res.json({
    swagger:
      "the API documentation  is now available on https://realworld-temp-api.herokuapp.com/api"
  });
});

app.use((err: HttpException, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  const statusCode = err.errorCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMsg = err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: statusCode,
    message: errorMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

/**
 * Starting the server
 */

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.info(`Server is running at http://localhost:${PORT}`);
});
