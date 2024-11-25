export interface Transaction {
  id: string;
  userId: number;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  date: Date;
}

export interface Budget {
  userId: number;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
}

export interface UserData {
  telegramId: number;
  monthlyIncome: number;
  budgets: Budget[];
  transactions: Transaction[];
}