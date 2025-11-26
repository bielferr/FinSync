import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

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