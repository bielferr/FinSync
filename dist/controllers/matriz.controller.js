"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialMatriz = void 0;
const cards_controller_1 = require("./cards.controller");
const getFinancialMatriz = async () => {
    // por enquanto outras fontes ficam vazias até implementarmos suas integrações
    const accountsPayable = [];
    const investments = [];
    const cards = await (0, cards_controller_1.getCards)();
    const totalPayable = accountsPayable.reduce((sum, a) => sum + Number(a.amount || 0), 0);
    const totalInvested = investments.reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalCardBalance = cards.reduce((sum, c) => sum + Number(c.balance || 0), 0);
    return {
        totalPayable,
        totalInvested,
        totalCardBalance,
        summary: {
            accountsPayableCount: accountsPayable.length,
            investmentsCount: investments.length,
            cardsCount: cards.length,
        }
    };
};
exports.getFinancialMatriz = getFinancialMatriz;
