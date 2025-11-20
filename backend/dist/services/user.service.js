"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
class UserService {
    async createUser(userData) {
        return await user_model_1.User.create(userData);
    }
    async getUserById(id) {
        return await user_model_1.User.findByPk(id);
    }
    async getUserByEmail(email) {
        return await user_model_1.User.findOne({ where: { email } });
    }
    async updateUser(id, updateData) {
        const user = await user_model_1.User.findByPk(id);
        if (user) {
            return await user.update(updateData);
        }
        return null;
    }
    async deleteUser(id) {
        const user = await user_model_1.User.findByPk(id);
        if (user) {
            await user.destroy();
            return true;
        }
        return false;
    }
}
exports.UserService = UserService;
