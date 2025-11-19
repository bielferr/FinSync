"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const userExists = await user_model_1.default.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ error: 'Email já cadastrado.' });
            }
            const user = await user_model_1.default.create({
                name,
                email,
                password,
                role: role || 'user',
            });
            return res.status(201).json({
                message: 'Usuário criado com sucesso!',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (err) {
            return res.status(500).json({ error: 'Erro ao registrar usuário.' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await user_model_1.default.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            const senhaValida = await user.validarSenha(password);
            if (!senhaValida) {
                return res.status(400).json({ error: 'Senha incorreta.' });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({
                message: 'Login realizado!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (err) {
            return res.status(500).json({ error: 'Erro ao fazer login.' });
        }
    }
}
exports.default = new AuthController();
