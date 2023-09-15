"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const teacher_service_1 = require("../services/teacher.service");
const token_utils_1 = require("../utils/token.utils");
const router = (0, express_1.Router)();
// Create
router.post("/teacher", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const schoolId = req.body.teacher.schoolId;
        const userId = await (0, token_utils_1.findUserIdByToken)(req.cookies.userToken);
        const teacher = await (0, teacher_service_1.createTeacher)(userId, schoolId);
        res.json({ teacher });
    }
    catch (error) {
        next(error);
    }
});
// Read
router.get("/teachers", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const schoolId = req.body.teachers.schoolId;
        const teachers = await (0, teacher_service_1.listTeachersInSchool)(schoolId);
        res.json({ teachers });
    }
    catch (error) {
        next(error);
    }
});
// Update
// Delete
exports.default = router;
//# sourceMappingURL=teacher.controller.js.map