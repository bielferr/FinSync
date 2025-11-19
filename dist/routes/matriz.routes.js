"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matriz_controller_1 = require("../controllers/matriz.controller");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    try {
        const matrix = (0, matriz_controller_1.getFinancialMatriz)();
        res.json(matrix);
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao buscar matriz financeira" });
    }
});
exports.default = router;
