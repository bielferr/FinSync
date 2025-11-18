"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const admin_1 = require("../middleware/admin");
const validator_1 = require("../middleware/validator");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// Registro e login
router.post('/register', (0, validator_1.validate)(auth_validator_1.registerSchema), authController_1.default.register);
router.post('/login', (0, validator_1.validate)(auth_validator_1.loginSchema), authController_1.default.login);
// Rota somente para admin
router.get('/admin', auth_1.auth, admin_1.admin, (req, res) => {
    return res.json({ message: 'Área administrativa liberada!' });
});
// Rota apenas autenticado
router.get('/me', auth_1.auth, (req, res) => {
    return res.json({ user: req.user });
});
exports.default = router;
