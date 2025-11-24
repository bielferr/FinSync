import { Request, Response, NextFunction } from 'express';

export function admin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Não autenticado.' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Acesso negado. Apenas administradores.' 
    });
  }

  return next();
}