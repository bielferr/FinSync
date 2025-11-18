import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  // Lista todos os usuários (somente admin)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }

  // Busca um usuário específico
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(Number(id));

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro interno ao buscar usuário." });
    }
  }
}
