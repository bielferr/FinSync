import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
  private userService = new UserService();

  // Registrar novo usuário
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          error: 'Nome, email e senha são obrigatórios'
        });
        return;
      }

      // Usar UserService em vez de User.create diretamente
      const user = await this.userService.createUser({
        name,
        email,
        password // O service agora faz o hash
      });

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token
        }
      });

    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.message === 'Email já está em uso') {
        res.status(409).json({
          success: false,
          error: 'Este email já está cadastrado'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };

  // Login do usuário
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
        return;
      }

      // Buscar usuário usando UserService
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
        return;
      }

      // Verificar senha
      const senhaValida = await user.validarSenha(password);

      if (!senhaValida) {
        res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
        return;
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };

  // Obter perfil do usuário (protegido)
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user;

      // Buscar dados atualizados do usuário
      const userData = await this.userService.getUserById(user.id);

      if (!userData) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          }
        }
      });

    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };

  // Atualizar perfil do usuário (protegido)
  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = (req as any).user;
      const { name, password } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (password) updateData.password = password;

      // Usar UserService para atualizar
      const updatedUser = await this.userService.updateUser(userData.id, updateData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
          }
        }
      });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  };
}

export default AuthController;