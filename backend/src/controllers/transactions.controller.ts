import { Request, Response } from 'express';
import { z } from 'zod';
import Transaction from '../models/transaction.model';

class TransactionsController {
  // Listar todas as transações do usuário logado
  async list(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const items = await Transaction.findAll({
        where: { userId: req.user.id },
        order: [['date', 'DESC']], // opcional: ordenar por data
      });

      return res.json(items);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar transações' });
    }
  }

  // Buscar transação pelo ID
  async get(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const tx = await Transaction.findOne({
        where: { id: Number(req.params.id), userId: req.user.id },
      });

      if (!tx) return res.status(404).json({ error: 'Transação não encontrada' });

      return res.json(tx);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar transação' });
    }
  }

  // Criar nova transação
  async create(req: Request, res: Response) {
    const schema = z.object({
      description: z.string().min(1),
      amount: z.number().nonnegative(),
      date: z.string(),
      type: z.enum(['credit', 'debit']),
      cardId: z.number().optional(),
    });

    try {
      const data = schema.parse(req.body);

      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const created = await Transaction.create({
        ...data,
        userId: req.user.id, // força usuário logado
        date: new Date(data.date),
      } as any);

      return res.status(201).json(created);
    } catch (err: any) {
      if (err?.issues) {
        return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
      }
      return res.status(400).json({ error: 'Erro ao criar transação' });
    }
  }

  // Atualizar transação
  async update(req: Request, res: Response) {
    const schema = z.object({
      description: z.string().min(1).optional(),
      amount: z.number().nonnegative().optional(),
      date: z.string().optional(),
      type: z.enum(['credit', 'debit']).optional(),
      cardId: z.number().optional(),
    });

    try {
      const data = schema.parse(req.body);

      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const tx = await Transaction.findOne({
        where: { id: Number(req.params.id), userId: req.user.id },
      });

      if (!tx) return res.status(404).json({ error: 'Transação não encontrada' });

      await tx.update({
        ...data,
        date: data.date ? new Date(data.date) : tx.date,
      });

      return res.json(tx);
    } catch (err: any) {
      if (err?.issues) {
        return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
      }
      return res.status(400).json({ error: 'Erro ao atualizar transação' });
    }
  }

  // Deletar transação
  async delete(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const tx = await Transaction.findOne({
        where: { id: Number(req.params.id), userId: req.user.id },
      });

      if (!tx) return res.status(404).json({ error: 'Transação não encontrada' });

      await tx.destroy();

      return res.json({ message: 'Transação removida' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar transação' });
    }
  }
}

export default new TransactionsController();
