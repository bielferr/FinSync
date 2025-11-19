"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: 'Erro ao criar usuário' });
        }
    }
    async getUser(req, res) {
        try {
            const user = await userService.getUserById(parseInt(req.params.id));
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    }
}
exports.UserController = UserController;
