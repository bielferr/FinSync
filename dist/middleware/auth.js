"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = admin;
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function admin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem acessar.' });
    }
    return next();
}
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}
