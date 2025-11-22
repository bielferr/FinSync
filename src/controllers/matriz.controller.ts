import { getCards } from "./cards.controller";

export const getFinancialMatriz = async () => {
  // por enquanto outras fontes ficam vazias até implementarmos suas integrações
  const accountsPayable: any[] = [];
  const investments: any[] = [];
  const cards = await getCards();

  const totalPayable = accountsPayable.reduce((sum: number, a: any) => sum + Number(a.amount || 0), 0);
  const totalInvested = investments.reduce((sum: number, i: any) => sum + Number(i.amount || 0), 0);
  const totalCardBalance = cards.reduce((sum: number, c: any) => sum + Number(c.balance || 0), 0);

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