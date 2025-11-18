import { Request, Response } from 'express';
import { z } from 'zod';
import AccountReceivable from '../models/accountsReceivable.model';

export class AccountsReceivableController {
  // GET todas as contas do usuário logado
  async getAccountsReceivable(req: Request, res: Response) {
    try {
      // Verifica se o usuário está autenticado
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      // Busca apenas as contas do usuário logado
      const accounts = await AccountReceivable.findAll({
        where: { userId: req.user.id },
        order: [['dueDate', 'ASC']], // opcional: ordenar por data
      });

      res.json(accounts);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar contas a receber' });
    }
  }

  // POST criar nova conta
  async createAccountReceivable(req: Request, res: Response) {
    // Schema de validação - aceita apenas os campos esperados
    const createSchema = z.object({
      client: z.string().min(1),
      amount: z.number().nonnegative(),
      received_date: z.string().optional(),
    });

    try {
      // Valida e retorna apenas os campos permitidos
      const data = createSchema.parse(req.body);

      // Garante que o usuário está autenticado
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      // Cria a conta no banco vinculando ao usuário logado
      const account = await AccountReceivable.create({
        client: data.client,
        amount: data.amount,
        receivedDate: data.received_date ? new Date(data.received_date) : undefined,
        userId: req.user.id,
        status: 'pending', // força o status inicial
      });

      res.status(201).json(account);
    } catch (err: any) {
      if (err?.issues) {
        // Erro do zod
        return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
      }
      return res.status(400).json({ error: 'Erro ao criar conta a receber' });
    }
  }

  // PUT atualizar conta
  async updateAccountReceivable(req: Request, res: Response) {
    // Schema de validação - aceita apenas os campos que podem ser atualizados
    const updateSchema = z.object({
      client: z.string().min(1).optional(),
      amount: z.number().nonnegative().optional(),
      received_date: z.string().optional(),
      status: z.enum(['pending', 'received']).optional(),
    });

    try {
      const data = updateSchema.parse(req.body);
      const { id } = req.params;

      // Verifica se o usuário está autenticado
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      // Busca a conta pelo id e usuário logado
      const account = await AccountReceivable.findOne({
        where: { id, userId: req.user.id },
      });

      if (!account) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      // Atualiza os campos permitidos
      await account.update({
        client: data.client ?? account.client,
        amount: data.amount ?? account.amount,
        receivedDate: data.received_date ? new Date(data.received_date) : account.receivedDate,
        status: data.status ?? account.status,
      });

      return res.json(account);
    } catch (err: any) {
      if (err?.issues) {
        // Erro de validação
        return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
      }
      return res.status(400).json({ error: 'Erro ao atualizar conta' });
    }
  }

  // DELETE deletar conta
  async deleteAccountReceivable(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se o usuário está autenticado
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      // Busca a conta pelo id e usuário logado
      const account = await AccountReceivable.findOne({
        where: { id, userId: req.user.id },
      });

      if (!account) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }

      // Deleta a conta
      await account.destroy();

      return res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar conta' });
    }
  }
}

export default new AccountsReceivableController();
