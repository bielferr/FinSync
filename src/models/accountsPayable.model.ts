export interface AccountPayable {
  id: number;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}