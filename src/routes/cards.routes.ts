// src/routes/cards.routes.ts
import { Router } from "express";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard
} from "../controllers/cards.controller";

const router = Router();

router.get("/", (req, res) => {
  try {
    res.json(getCards());
  } catch {
    res.status(500).json({ error: "Erro ao buscar cartões" });
  }
});

router.post("/", (req, res) => {
  try {
    const card = createCard(req.body);
    res.status(201).json(card);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.put("/:id", (req, res) => {
  try {
    const updated = updateCard(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Cartão não encontrado" });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Dados inválidos" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deleted = deleteCard(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Cartão não encontrado" });
    res.json(deleted);
  } catch {
    res.status(400).json({ error: "Erro ao deletar cartão" });
  }
});

export default router;
