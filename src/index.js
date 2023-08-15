import swaggerUI from "swagger-ui-express";
import { readFile } from "fs/promises";
import { authRoutes } from "./controllers/auth.js";
import express from "express";
import "dotenv/config";

const swaggerFile = JSON.parse(
    await readFile(
        new URL("../swagger.json", import.meta.url)
    )
);

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));


app.listen(3000, function () {
    console.log("Server running in localhost:3000");
});
