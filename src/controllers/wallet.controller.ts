import { getCards } from "./cards.controller";

export const getWallet = () => {
  const cards = getCards();

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);

  return {
    totalBalance,
    cards
  };
};