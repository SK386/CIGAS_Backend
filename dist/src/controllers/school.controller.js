"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const school_service_1 = require("../services/school.service");
const router = (0, express_1.Router)();
// Create
router.post("/school", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const school = await (0, school_service_1.createSchool)(req.body.school.name);
        res.json({ school });
    }
    catch (error) {
        next(error);
    }
});
// Read
router.get("/schools", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const schools = await (0, school_service_1.listSchools)();
        res.json({ schools });
    }
    catch (error) {
        next(error);
    }
});
router.get("/school/:id", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const { id } = req.params;
        const school = await (0, school_service_1.findSchoolById)(parseInt(id));
        res.json({ school });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/school/:id", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body.school;
        const school = await (0, school_service_1.updateSchool)(parseInt(id), name);
        res.json({ school });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/school/:id", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const { id } = req.params;
        await (0, school_service_1.deleteSchool)(parseInt(id));
        res.json({ status: 200, message: "School deleted!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=school.controller.js.map