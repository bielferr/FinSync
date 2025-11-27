import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth";
import { admin } from "../middleware/admin";

const router = Router();
const controller = new UserController();

// Lista usuários (somente admin)
router.get("/perfil", authenticateToken, admin, (req, res) => controller.getAllUsers(req, res));

// Busca um usuário específico
router.get("/admin:id", authenticateToken, (req, res) => controller.getUser(req, res));

export default router;
