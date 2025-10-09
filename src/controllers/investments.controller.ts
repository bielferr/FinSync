interface Investment {
  id: number;
  name: string;
  amount: number;
  date: string;
}

let investments: Investment[] = [];

export const getInvestments = () => investments;

export const createInvestment = (data: Omit<Investment, "id">) => {
  const newInvestment = { id: investments.length + 1, ...data };
  investments.push(newInvestment);
  return newInvestment;
};

export const updateInvestment = (id: number, data: Partial<Omit<Investment, "id">>) => {
  const investment = investments.find(i => i.id === id);
  if (!investment) return null;
  Object.assign(investment, data);
  return investment;
};

export const deleteInvestment = (id: number) => {
  const index = investments.findIndex(i => i.id === id);
  if (index === -1) return null;
  return investments.splice(index, 1)[0];
};
