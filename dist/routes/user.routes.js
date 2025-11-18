"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.get("/profile", auth_1.auth, (req, res) => {
    userController.getUser(req, res);
});
exports.default = router;
