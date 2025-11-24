import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware de autenticação geral
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'Token de acesso necessário'
      });
      return;
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token mal formatado'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Buscar usuário no banco para garantir que ainda existe
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não encontrado'
      });
      return;
    }

    // Adicionar usuário à request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();

  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(403).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
};

// Middleware para verificar se é admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Acesso restrito a administradores'
    });
    return;
  }

  next();
};