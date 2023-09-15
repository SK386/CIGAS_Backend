"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = exports.sixtyDaysInSeconds = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const auth_1 = require("../utils/auth");
const token_utils_1 = require("../utils/token.utils");
const user_service_1 = require("./user.service");
exports.sixtyDaysInSeconds = 60 * 24 * 60 * 60 * 1000;
const checkUserUniqueness = async (email) => {
    const existingUserByEmail = await prisma_client_1.default.user.findUnique({
        where: {
            email
        }
    });
    if (existingUserByEmail) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User already exists!");
    }
};
const createUser = async (input) => {
    const invalidUser = (0, auth_1.isValidNewUser)(input);
    if (invalidUser) {
        throw invalidUser;
    }
    await checkUserUniqueness(input.email);
    const salt = await bcrypt_1.default.genSalt(12);
    const hashedPassword = await bcrypt_1.default.hash(input.password, salt);
    const user = await prisma_client_1.default.user.create({
        data: {
            FirstName: input.FirstName,
            LastName: input.LastName,
            email: input.email,
            password: hashedPassword,
            phone: input.phone ?? undefined,
            role: input.role
        },
        select: {
            FirstName: true,
            LastName: true,
            email: true,
            phone: true,
            role: true
        }
    });
    return user;
};
exports.createUser = createUser;
const login = async (userPayload) => {
    const invalidUser = (0, auth_1.isValidLoginUser)(userPayload);
    if (invalidUser) {
        throw invalidUser;
    }
    const user = await (0, user_service_1.FindUserByEmail)(userPayload.email, true);
    if (user) {
        const match = await bcrypt_1.default.compare(userPayload.password, String(user.password));
        if (match) {
            const { password: _, ...userNoPass } = user;
            return {
                ...userNoPass,
                token: (0, token_utils_1.generateToken)(user)
            };
        }
        else {
            throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY, "Wrong password!");
        }
    }
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map