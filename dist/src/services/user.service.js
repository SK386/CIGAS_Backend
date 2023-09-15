"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserById = exports.FindUserByEmail = exports.deleteUser = exports.updateUser = exports.searchUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const user_utils_1 = require("../utils/user.utils");
const searchUser = async (q, uuid) => {
    const baseQuery = {
        OR: [
            {
                FirstName: {
                    contains: q
                }
            },
            {
                LastName: {
                    contains: q
                }
            }
        ]
    };
    const query = uuid ? { ...baseQuery, id: uuid } : baseQuery;
    const users = await prisma_client_1.default.user.findMany({
        where: query
    });
    const usersNoPass = users.map(({ password, phone, ...user }) => user);
    return usersNoPass;
};
exports.searchUser = searchUser;
const updateUser = async (id, updatedUserData) => {
    try {
        await (0, exports.FindUserById)(id, false);
        (0, user_utils_1.validateUserPatch)(updatedUserData);
        // Check if a new password is provided in updatedUserData
        if (updatedUserData.password) {
            // Hash the new password using bcrypt
            const salt = await bcrypt_1.default.genSalt(12);
            const hashedPassword = await bcrypt_1.default.hash(updatedUserData.password, salt);
            // Update the password with the hashed password
            updatedUserData.password = hashedPassword;
        }
        const updatedUser = await prisma_client_1.default.user.update({
            where: {
                id
            },
            data: updatedUserData
        });
        return updatedUser;
    }
    catch (error) {
        if (error instanceof http_exception_model_1.default) {
            throw error;
        }
        console.log(error);
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error, try again later!");
    }
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    try {
        await prisma_client_1.default.user.delete({
            where: {
                id
            }
        });
    }
    catch (error) {
        console.log(error);
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error, try again later!");
    }
};
exports.deleteUser = deleteUser;
const FindUserByEmail = async (email, password) => {
    const user = await prisma_client_1.default.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            FirstName: true,
            LastName: true,
            email: true,
            phone: true,
            role: true,
            password
        }
    });
    if (user) {
        return user;
    }
    else {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
};
exports.FindUserByEmail = FindUserByEmail;
const FindUserById = async (id, password) => {
    const user = await prisma_client_1.default.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            FirstName: true,
            LastName: true,
            email: true,
            phone: true,
            role: true,
            password
        }
    });
    if (user) {
        return user;
    }
    else {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
};
exports.FindUserById = FindUserById;
//# sourceMappingURL=user.service.js.map