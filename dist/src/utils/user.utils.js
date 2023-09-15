"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserPatch = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const validator_1 = __importDefault(require("validator"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const validateUserPatch = (user) => {
    if (user.email && !validator_1.default.isEmail(user.email)) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!");
    }
    // Phone number is not mandatory
    if (user.phone && !validator_1.default.isMobilePhone(user.phone)) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!");
    }
    if (user.role && user.role !== client_1.UserRole.STUDENT && user.role !== client_1.UserRole.TEACHER) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "You need a valid role! It can be either STUDENT or TEACHER.");
    }
};
exports.validateUserPatch = validateUserPatch;
//# sourceMappingURL=user.utils.js.map