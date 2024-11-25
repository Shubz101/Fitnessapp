import React from 'react';
import { Budget } from '../types';

interface Props {
  budgets: Budget[];
}

export default function BudgetOverview({ budgets }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Budget Overview</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {budgets.map((budget) => (
          <div key={budget.category} className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{budget.category}</h3>
              <span className="text-sm text-gray-500">{budget.period}</span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    (budget.spent / budget.limit) > 0.9 ? 'bg-red-600' :
                    (budget.spent / budget.limit) > 0.7 ? 'bg-yellow-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>${budget.spent.toFixed(2)} spent</span>
                <span>${budget.limit.toFixed(2)} limit</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}