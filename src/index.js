import { usersRoutes } from "./controllers/users.js";
import { authRoutes } from "./controllers/auth.js";
import swaggerUI from "swagger-ui-express";
import { readFile } from "fs/promises";
import express from "express";
import "dotenv/config";


const swaggerFile = JSON.parse(
    await readFile(
        new URL("../swagger.json", import.meta.url)
    )
);

const app = express();
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Application routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);


app.listen(3000, function () {
    console.log("Server running in localhost:3000");
});
