
import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";
import { auth } from "../middleware/auth";

const router = Router();

// GET /wallet
router.get("/", auth, walletController.getWalletByUser);

export default router;
