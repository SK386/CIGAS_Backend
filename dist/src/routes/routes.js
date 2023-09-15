"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const school_controller_1 = __importDefault(require("../controllers/school.controller"));
const teacher_controller_1 = __importDefault(require("../controllers/teacher.controller"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const api = (0, express_1.Router)()
    .use(auth_controller_1.default)
    .use(school_controller_1.default)
    .use(teacher_controller_1.default)
    .use(article_controller_1.default)
    .use(user_controller_1.default);
api.get("/", (req, res) => {
    return res.json({ message: "API is running!" });
});
exports.default = (0, express_1.Router)().use("/api", api);
//# sourceMappingURL=routes.js.map