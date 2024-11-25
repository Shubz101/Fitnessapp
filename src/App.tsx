import React, { useEffect, useState } from 'react';
import { Transaction, Budget, UserData } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetOverview from './components/BudgetOverview';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user: {
            id: number;
          };
        };
      };
    };
  }
}

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.Telegram.WebApp.ready();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-data');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        fetchUserData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <TransactionForm onSubmit={handleTransactionSubmit} />
      {userData && (
        <>
          <BudgetOverview budgets={userData.budgets} />
          <TransactionList transactions={userData.transactions} />
        </>
      )}
    </div>
  );
}

export default App;