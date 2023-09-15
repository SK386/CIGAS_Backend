"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserIdByToken = exports.generateToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const user_service_1 = require("../services/user.service");
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET ?? "superSecret", { expiresIn: "60 days" });
};
exports.generateToken = generateToken;
const findUserIdByToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET ?? "superSecret");
        // We're not interested in handling the user but rather, in finding out if the user exists.
        await (0, user_service_1.FindUserById)(decoded.id, false);
        return Number(decoded.id);
    }
    catch (err) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is not valid!");
    }
};
exports.findUserIdByToken = findUserIdByToken;
//# sourceMappingURL=token.utils.js.map