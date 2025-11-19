"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/cards.routes.ts
const express_1 = require("express");
const cards_controller_1 = require("../controllers/cards.controller");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const cards = await (0, cards_controller_1.getCards)();
        res.json(cards);
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao buscar cartões" });
    }
});
router.post("/", async (req, res) => {
    try {
        const card = await (0, cards_controller_1.createCard)(req.body);
        res.status(201).json(card);
    }
    catch (err) {
        res.status(400).json({ error: "Dados inválidos" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const updated = await (0, cards_controller_1.updateCard)(Number(req.params.id), req.body);
        if (!updated)
            return res.status(404).json({ error: "Cartão não encontrado" });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: "Dados inválidos" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await (0, cards_controller_1.deleteCard)(Number(req.params.id));
        if (!deleted)
            return res.status(404).json({ error: "Cartão não encontrado" });
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json({ error: "Erro ao deletar cartão" });
    }
});
exports.default = router;
