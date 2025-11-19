import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado.' });
      }

      const user = await User.create({
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
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const senhaValida = await user.validarSenha(password);

      if (!senhaValida) {
        return res.status(400).json({ error: 'Senha incorreta.' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

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
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

export default new AuthController();
