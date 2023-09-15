"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = __importDefault(require("../middleware/authentication.middleware"));
const user_service_1 = require("../services/user.service");
const token_utils_1 = require("../utils/token.utils");
const router = (0, express_1.Router)();
router.post("/users/search", authentication_middleware_1.default, async (req, res, next) => {
    try {
        // TODO: Search by Id isn't working
        const users = await (0, user_service_1.searchUser)(req.body.q, parseInt(req.body.id));
        res.json({ users });
    }
    catch (error) {
        next(error);
    }
});
router.get("/user", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        const userID = await (0, token_utils_1.findUserIdByToken)(token);
        const user = await (0, user_service_1.FindUserById)(userID, false);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/user", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        const userID = await (0, token_utils_1.findUserIdByToken)(token);
        const updatedUser = await (0, user_service_1.updateUser)(userID, req.body.user);
        const { password, ...userNoPass } = updatedUser;
        res.json(userNoPass);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/user", authentication_middleware_1.default, async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        const userID = await (0, token_utils_1.findUserIdByToken)(token);
        await (0, user_service_1.deleteUser)(userID);
        res.clearCookie("userToken");
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=user.controller.js.map