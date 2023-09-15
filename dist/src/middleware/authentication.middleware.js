"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const token_utils_1 = require("../utils/token.utils");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is missing! Access Denied!");
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRET ?? "superSecret");
        // It's not likely to happen but a token can be valid while the user doesn't exist anymore
        await (0, token_utils_1.findUserIdByToken)(token);
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=authentication.middleware.js.map