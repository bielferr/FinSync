interface Card {
  id: number;
  name: string;
  limit: number;
  due_day: number;
  balance: number;
}

let cards: Card[] = [];

export const getCards = () => cards;

export const createCard = (data: Omit<Card, "id" | "balance">) => {
  const newCard = { id: cards.length + 1, balance: 0, ...data }; // balance inicia em 0
  cards.push(newCard);
  return newCard;
};

export const updateCard = (id: number, data: Partial<Omit<Card, "id">>) => {
  const card = cards.find(c => c.id === id);
  if (!card) return null;
  Object.assign(card, data);
  return card;
};

export const deleteCard = (id: number) => {
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) return null;
  return cards.splice(index, 1)[0];
};
