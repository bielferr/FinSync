import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

export class UserService {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      // Verificar se email já existe
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Fazer hash da senha antes de criar
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      return await User.create({
        ...userData,
        password: hashedPassword
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    return await User.findByPk(id);
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ["password"] }
    });
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await User.findByPk(id);
    if (user) {
      // Se estiver atualizando a senha, fazer hash
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }
      return await user.update(updateData);
    }
    return null;
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  }
}