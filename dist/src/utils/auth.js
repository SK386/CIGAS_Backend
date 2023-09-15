"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNewUser = exports.isValidLoginUser = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const validator_1 = __importDefault(require("validator"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
function isValidLoginUser(User) {
    if (!User.email) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
    }
    if (!User.password) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
    }
}
exports.isValidLoginUser = isValidLoginUser;
const isValidNewUser = (User) => {
    if (!User.FirstName) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a first name!");
    }
    if (!User.LastName) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a last name!");
    }
    if (!User.email) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!");
    }
    else if (!validator_1.default.isEmail(User.email)) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!");
    }
    // Phone number is not mandatory
    if (User.phone && !validator_1.default.isMobilePhone(User.phone)) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!");
    }
    if (!User.password) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!");
    }
    if (!User.role || (User.role !== client_1.UserRole.STUDENT && User.role !== client_1.UserRole.TEACHER)) {
        return new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a valid role! It can be either STUDENT or TEACHER.");
    }
};
exports.isValidNewUser = isValidNewUser;
//# sourceMappingURL=auth.js.map