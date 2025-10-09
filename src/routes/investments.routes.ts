import { Router } from "express";
import { 
  getInvestments, 
  createInvestment, 
  updateInvestment, 
  deleteInvestment 
} from "../controllers/investments.controller";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.json(getInvestments());
  } catch {
    res.status(500).json({ error: "Erro ao buscar investimentos" });
  }
});

router.post("/", (req, res) => {
  try {
    const inv = createInvestment(req.body);
    res.status(201).json(inv);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const updated = updateInvestment(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Investimento não encontrado" });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteInvestment(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Investimento não encontrado" });
    res.json(deleted);
  } catch {
    res.status(400).json({ error: "Erro ao deletar investimento" });
  }
});

export default router;
