import { Router } from "express";
import { getWallet } from "../controllers/wallet.controller";

const router = Router();

router.get("/", (req, res) => {
  try {
    const wallet = getWallet();
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar carteira digital" });
  }
});

export default router;