import { getAccountsPayable } from "./accountsPayable.controller";
import { getInvestments } from "./investments.controller";
import { getCards } from "./cards.controller";

export const getFinancialMatriz = () => {
  const accountsPayable = getAccountsPayable();
  const investments = getInvestments();
  const cards = getCards();

  const totalPayable = accountsPayable.reduce((sum, a) => sum + a.amount, 0);
  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalCardBalance = cards.reduce((sum, c) => sum + c.balance, 0);

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