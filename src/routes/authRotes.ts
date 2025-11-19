import { Router } from 'express';
import AuthController from '../controllers/authController';
import { auth } from '../middleware/auth';
import { admin } from '../middleware/admin';
import { validate } from '../middleware/validator';
import { registerSchema, loginSchema } from '../validators/auth.validator';


const router = Router();

// Registro e login
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);


// Rota somente para admin
router.get('/admin', auth, admin, (req, res) => {
  return res.json({ message: 'Área administrativa liberada!' });
});

// Rota apenas autenticado
router.get('/me', auth, (req, res) => {
  return res.json({ user: req.user });
});



export default router;
