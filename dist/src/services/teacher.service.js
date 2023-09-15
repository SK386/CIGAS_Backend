"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTeacherIdByUserId = exports.findUserByTeacherId = exports.findTeacherById = exports.listTeachersInSchool = exports.createTeacher = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_client_1 = __importDefault(require("../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../models/http-exception.model"));
const school_service_1 = require("./school.service");
const user_service_1 = require("./user.service");
// Create
const createTeacher = async (userId, schoolId) => {
    // Ensure that the school exists:
    await (0, school_service_1.findSchoolById)(schoolId);
    const teacher = await prisma_client_1.default.teacher.create({
        data: {
            user_id: userId,
            school_id: schoolId
        }
    });
    return teacher;
};
exports.createTeacher = createTeacher;
// Read
const listTeachersInSchool = async (schoolId) => {
    // Ensure that the school exists:
    await (0, school_service_1.findSchoolById)(schoolId);
    const teachers = await prisma_client_1.default.teacher.findMany({
        where: {
            school_id: schoolId
        }
    });
    return teachers;
};
exports.listTeachersInSchool = listTeachersInSchool;
const findTeacherById = async (teacherId) => {
    const teacher = await prisma_client_1.default.teacher.findUnique({
        where: {
            id: teacherId
        }
    });
    if (teacher) {
        return teacher;
    }
    else {
        throw new http_exception_model_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Teacher not found!");
    }
};
exports.findTeacherById = findTeacherById;
const findUserByTeacherId = async (teacherId) => {
    const teacher = await (0, exports.findTeacherById)(teacherId);
    const user = await (0, user_service_1.FindUserById)(teacher?.user_id, false);
    return user;
};
exports.findUserByTeacherId = findUserByTeacherId;
const findTeacherIdByUserId = async (userId) => {
    await (0, user_service_1.FindUserById)(userId, false);
    const teacherId = await prisma_client_1.default.teacher.findUnique({
        where: {
            user_id: userId
        },
        select: {
            id: true
        }
    });
    return teacherId?.id;
};
exports.findTeacherIdByUserId = findTeacherIdByUserId;
// Update
// Delete
//# sourceMappingURL=teacher.service.js.map