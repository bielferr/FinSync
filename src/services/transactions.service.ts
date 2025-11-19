import Transaction from '../models/transaction.model';

export class TransactionsService {
  async listAll() {
    return await Transaction.findAll({ include: ['user', 'card'] });
  }

  async getById(id: number) {
    return await Transaction.findByPk(id, { include: ['user', 'card'] });
  }

  async create(data: Partial<Transaction>) {
    return await Transaction.create(data as any);
  }

  async update(id: number, data: Partial<Transaction>) {
    const tx = await Transaction.findByPk(id);
    if (!tx) return null;
    await tx.update(data as any);
    return tx;
  }

  async delete(id: number) {
    const tx = await Transaction.findByPk(id);
    if (!tx) return null;
    await tx.destroy();
    return tx;
  }
}

export default new TransactionsService();
