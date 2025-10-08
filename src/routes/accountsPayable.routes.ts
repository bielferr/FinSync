import { Router } from "express";
import { createAccountPayable, getAccountsPayable, updateAccountPayable, deleteAccountPayable } from "../controllers/accountsPayable.controller";

const router = Router();

// GET todas
router.get("/", (req, res) => {
  try {
    const accounts = getAccountsPayable();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar contas" });
  }
});

// POST nova conta
router.post("/", (req, res) => {
  try {
    const account = createAccountPayable(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

// PUT atualizar conta
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updated = updateAccountPayable(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: "Conta não encontrada" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

// DELETE conta
router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteAccountPayable(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Conta não encontrada" });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar conta" });
  }
});

export default router;
