import { Router } from "express";
import { getFinancialMatriz } from "../controllers/matriz.controller";

const router = Router();

router.get("/dashboard.html", (req, res) => {
  try {
    const matrix = getFinancialMatriz();
    res.json(matrix);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar matriz financeira" });
  }
});

export default router;