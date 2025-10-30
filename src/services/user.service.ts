import { User } from '../models/user.model';

export class UserService {
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    return await User.create(userData);
  }

  async getUserById(id: number) {
    return await User.findByPk(id);
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async updateUser(id: number, updateData: Partial<User>) {
    const user = await User.findByPk(id);
    if (user) {
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