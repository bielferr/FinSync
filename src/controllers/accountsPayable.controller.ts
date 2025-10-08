interface AccountPayable {
  id: number;
  description: string;
  amount: number;
  due_date: string;
}

// Array em memória
let accountsPayable: AccountPayable[] = [];

// GET todas
export const getAccountsPayable = () => {
  return accountsPayable;
};

// POST nova conta
export const createAccountPayable = (data: Omit<AccountPayable, "id">) => {
  const newAccount: AccountPayable = {
    id: accountsPayable.length + 1,
    ...data
  };
  accountsPayable.push(newAccount);
  return newAccount;
};

// PUT atualizar conta
export const updateAccountPayable = (id: number, data: Partial<Omit<AccountPayable, "id">>) => {
  const account = accountsPayable.find(a => a.id === id);
  if (!account) return null;

  account.description = data.description ?? account.description;
  account.amount = data.amount ?? account.amount;
  account.due_date = data.due_date ?? account.due_date;

  return account;
};

// DELETE conta
export const deleteAccountPayable = (id: number) => {
  const index = accountsPayable.findIndex(a => a.id === id);
  if (index === -1) return null;

  const deleted = accountsPayable.splice(index, 1);
  return deleted[0];
};
