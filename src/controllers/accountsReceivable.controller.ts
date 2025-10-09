interface AccountReceivable {
  id: number;
  client: string;
  amount: number;
  received_date: string;
}

let accountsReceivable: AccountReceivable[] = [];

export const getAccountsReceivable = () => accountsReceivable;

export const createAccountReceivable = (data: Omit<AccountReceivable, "id">) => {
  const newAccount = { id: accountsReceivable.length + 1, ...data };
  accountsReceivable.push(newAccount);
  return newAccount;
};

export const updateAccountReceivable = (id: number, data: Partial<Omit<AccountReceivable, "id">>) => {
  const account = accountsReceivable.find(a => a.id === id);
  if (!account) return null;
  Object.assign(account, data);
  return account;
};

export const deleteAccountReceivable = (id: number) => {
  const index = accountsReceivable.findIndex(a => a.id === id);
  if (index === -1) return null;
  return accountsReceivable.splice(index, 1)[0];
};
