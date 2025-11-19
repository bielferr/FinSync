import { Request, Response } from "express";
import Card from "../models/cards.model";

export const getWallet = async (userId: number) => {
  // Filtra cards do usuário logado
  const cards = await Card.findAll({
    where: { userId } as any, // corrige erro de TS
  });

  // Calcula saldo total
  const totalBalance = cards.reduce((sum: number, c: any) => sum + Number(c.balance), 0);

  return { totalBalance, cards };
};

export const walletController = {
  async getWalletByUser(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const wallet = await getWallet(req.user.id);

      return res.json(wallet);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar carteira digital" });
    }
  },
};
