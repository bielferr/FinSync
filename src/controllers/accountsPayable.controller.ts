import { Request, Response } from 'express';
import AccountPayable from '../models/accountsPayable.model';

class AccountPayableController {

  //  todas as contas do usuário (admin vê todas)
  async getAll(req: Request, res: Response) {
    try {
      const accounts = req.user!.role === 'admin'
        ? await AccountPayable.findAll({ include: ['user'] }) // admin vê todas
        : await AccountPayable.findAll({ where: { userId: req.user!.id } }); // usuário vê só as suas

      return res.json(accounts);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar contas.' });
    }
  }

  //  nova conta
  async create(req: Request, res: Response) {
    try {
      const { description, amount, dueDate, status } = req.body;

      const newAccount = await AccountPayable.create({
        description,
        amount,
        dueDate,
        status: status || 'pending',
        userId: req.user!.id, // associa ao usuário logado
      });

      return res.status(201).json(newAccount);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao criar conta.' });
    }
  }

  //  atualizar conta
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const account = await AccountPayable.findByPk(id);

      if (!account) return res.status(404).json({ error: 'Conta não encontrada.' });

      // só dono ou admin podem atualizar
      if (account.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Não autorizado.' });
      }

      await account.update(req.body);
      return res.json(account);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar conta.' });
    }
  }

  // DELETE conta
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const account = await AccountPayable.findByPk(id);

      if (!account) return res.status(404).json({ error: 'Conta não encontrada.' });

      // só dono ou admin podem deletar
      if (account.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Não autorizado.' });
      }

      await account.destroy();
      return res.json({ message: 'Conta removida com sucesso!' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar conta.' });
    }
  }
}

export default new AccountPayableController();
