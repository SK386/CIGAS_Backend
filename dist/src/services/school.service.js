"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchool = exports.updateSchool = exports.findSchoolById = exports.listSchools = exports.createSchool = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
// Create
const createSchool = async (name) => {
    const existingSchool = await prisma_client_1.default.school.findUnique({
        where: {
            name
        }
    });
    if (existingSchool) {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.CONFLICT, "School already exists!");
    }
    const school = await prisma_client_1.default.school.create({
        data: {
            name
        }
    });
    return school;
};
exports.createSchool = createSchool;
// Read
const listSchools = async () => {
    return await prisma_client_1.default.school.findMany({});
};
exports.listSchools = listSchools;
const findSchoolById = async (id) => {
    const school = await prisma_client_1.default.school.findUnique({
        where: {
            id
        }
    });
    if (school) {
        return school;
    }
    throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "School does not exist!");
};
exports.findSchoolById = findSchoolById;
// Update
const updateSchool = async (id, name) => {
    // Check if the school exists
    await (0, exports.findSchoolById)(id);
    const updatedSchool = await prisma_client_1.default.school.update({
        where: {
            id
        },
        data: {
            name
        }
    });
    return updatedSchool;
};
exports.updateSchool = updateSchool;
// Delete
const deleteSchool = async (id) => {
    // Check if the school exists
    await (0, exports.findSchoolById)(id);
    await prisma_client_1.default.school.delete({
        where: {
            id
        }
    });
};
exports.deleteSchool = deleteSchool;
//# sourceMappingURL=school.service.js.map