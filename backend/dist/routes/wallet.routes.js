"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    try {
        const wallet = (0, wallet_controller_1.getWallet)();
        res.json(wallet);
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao buscar carteira digital" });
    }
});
exports.default = router;
