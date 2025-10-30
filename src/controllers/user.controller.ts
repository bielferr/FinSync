import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar usuário' });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
}