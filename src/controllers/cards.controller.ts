import { Card } from "../models/cards.model";

// Controller de cartões

export const getCards = async (): Promise<Card[]> => {
  // Busca todos os cartões
  return Card.findAll();
};

export const createCard = async (data: Partial<Card>): Promise<Card> => {
  // Cria um novo cartão

  const created = await Card.create(data as any);
  return created;
};

export const updateCard = async (id: number, data: Partial<Card>): Promise<Card | null> => {
  // Atualiza um cartão existente
  const card = await Card.findByPk(id);
  if (!card) return null;
  await card.update(data as any);
  return card;
};

export const deleteCard = async (id: number): Promise<Card | null> => {
  // Deleta um cartão
  const card = await Card.findByPk(id);
  if (!card) return null;
  await card.destroy();
  return card;
};
