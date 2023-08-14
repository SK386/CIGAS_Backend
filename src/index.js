import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

// Controllers
import { register, login, tokenMiddleware } from "./controllers/auth.js";

app.get("/", (req, res) => {
    res.json({msg: "Hello, World!"});
});

app.get("/authorized", tokenMiddleware, (req, res) => {
    res.json({msg: "Authorized!"});
});

app.post("/auth/register", register);
app.post("/auth/login", login);

app.listen(3000, function () {
    console.log("Server running in localhost:3000");
});
