import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post('/cadastro.html', authController.register);
router.post('/login.html', authController.login);

// Rotas protegidas
router.get('/perfil.html', authenticateToken, authController.getProfile);
router.put('/perfil.html', authenticateToken, authController.updateProfile);

// Rota apenas autenticado
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ 
    success: true,
    data: {
      user: req.user 
    }
  });
});

export default router;