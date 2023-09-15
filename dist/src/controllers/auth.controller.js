"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const router = (0, express_1.Router)();
router.post("/users", async (req, res, next) => {
    try {
        const user = await (0, auth_service_1.createUser)(req.body.user);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
});
router.post("/users/login", async (req, res, next) => {
    try {
        const user = await (0, auth_service_1.login)(req.body.user);
        res.cookie("userToken", user?.token, {
            maxAge: auth_service_1.sixtyDaysInSeconds,
            httpOnly: true,
            secure: Boolean(process.env.COOKIE_SECURE) ?? false
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.controller.js.map