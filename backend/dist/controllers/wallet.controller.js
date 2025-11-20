"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = void 0;
const cards_controller_1 = require("./cards.controller");
const getWallet = async () => {
    const cards = await (0, cards_controller_1.getCards)();
    const totalBalance = cards.reduce((sum, c) => sum + Number(c.balance), 0);
    return {
        totalBalance,
        cards
    };
};
exports.getWallet = getWallet;
