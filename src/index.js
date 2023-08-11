import express from "express";

const app = express();
app.use(express.json());

// Controllers
import { register, login } from "./controllers/auth.js";

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ msg: "Hello, World!" }));
});

app.post("/auth/register", register);
app.post("/auth/login", login);

app.listen(3000, function () {
    console.log("Server running in localhost:3000");
});
