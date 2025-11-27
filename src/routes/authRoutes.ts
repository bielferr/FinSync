import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';


const router = Router();
const authController = new AuthController();

// ROTAS DA API (não HTML!)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

export default router;