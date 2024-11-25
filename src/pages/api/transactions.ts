import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/db';
import { Transaction } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    
    const userId = parseInt(req.headers['x-telegram-user-id'] as string);
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction: Omit<Transaction, 'id'> = req.body;
    
    const result = await db.collection('users').updateOne(
      { telegramId: userId },
      { 
        $push: { 
          transactions: {
            ...transaction,
            id: new Date().getTime().toString()
          }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update budget if it's an expense
    if (transaction.type === 'expense') {
      await db.collection('users').updateOne(
        { 
          telegramId: userId,
          'budgets.category': transaction.category
        },
        {
          $inc: { 'budgets.$.spent': transaction.amount }
        }
      );
    }

    res.status(200).json({ message: 'Transaction added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}