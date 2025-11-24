import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth"; // exige login
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cards.controller";

const router = Router();

// Rota GET para listar todos os cartões
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cards = await getCards();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cartões" });
  }
});

// Rota POST para criar um novo cartão
router.post("/", authenticateToken, async (req, res) => {
  try {
    const card = await createCard(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

// Rota PUT para atualizar um cartão existente
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await updateCard(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Cartão não encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

// Rota DELETE para remover um cartão
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await deleteCard(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Cartão não encontrado" });
    res.json({ message: "Cartão deletado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao deletar cartão" });
  }
});

export default router;
