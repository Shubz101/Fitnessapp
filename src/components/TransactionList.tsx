import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-medium">{transaction.category}</p>
              <p className="text-sm text-gray-500">{transaction.description}</p>
              <p className="text-xs text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <p className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}