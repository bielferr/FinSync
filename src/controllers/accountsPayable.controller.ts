import { Request, Response } from 'express';

interface AccountPayable {
  id: number;
  description: string;
  amount: number;
  dueDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

let accountsPayable: AccountPayable[] = []; // simulação do DB

export const getAllAccountsPayable = (req: Request, res: Response) => {
  res.json(accountsPayable);
};

export const getAccountPayableById = (req: Request, res: Response) => {
  const { id } = req.params;
  const account = accountsPayable.find(a => a.id === Number(id));
  if (!account) return res.status(404).json({ message: 'Not found' });
  res.json(account);
};

export const createAccountPayable = (req: Request, res: Response) => {
  const { description, amount, dueDate } = req.body;
  const newAccount: AccountPayable = {
    id: accountsPayable.length + 1,
    description,
    amount,
    dueDate: new Date(dueDate),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  accountsPayable.push(newAccount);
  res.status(201).json(newAccount);
};

export const updateAccountPayable = (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, amount, dueDate, status } = req.body;
  const account = accountsPayable.find(a => a.id === Number(id));
  if (!account) return res.status(404).json({ message: 'Not found' });

  account.description = description ?? account.description;
  account.amount = amount ?? account.amount;
  account.dueDate = dueDate ? new Date(dueDate) : account.dueDate;
  account.status = status ?? account.status;
  account.updatedAt = new Date();

  res.json(account);
};

export const deleteAccountPayable = (req: Request, res: Response) => {
  const { id } = req.params;
  accountsPayable = accountsPayable.filter(a => a.id !== Number(id));
  res.status(204).send();
};
