
import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// GET /wallet
router.get("/", authenticateToken, walletController.getWalletByUser);

export default router;
