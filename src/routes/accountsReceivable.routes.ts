import { Router } from "express";
import { 
  getAccountsReceivable, 
  createAccountReceivable, 
  updateAccountReceivable, 
  deleteAccountReceivable 
} from "../controllers/accountsReceivable.controller";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.json(getAccountsReceivable());
  } catch {
    res.status(500).json({ error: "Erro ao buscar contas a receber" });
  }
});

router.post("/", (req, res) => {
  try {
    const acc = createAccountReceivable(req.body);
    res.status(201).json(acc);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const updated = updateAccountReceivable(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Conta não encontrada" });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteAccountReceivable(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Conta não encontrada" });
    res.json(deleted);
  } catch {
    res.status(400).json({ error: "Erro ao deletar conta" });
  }
});

export default router;
