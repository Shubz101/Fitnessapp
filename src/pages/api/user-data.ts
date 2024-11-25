import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('finance-tracker');
    
    const userId = parseInt(req.headers['x-telegram-user-id'] as string);
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = await db.collection('users').findOne({ telegramId: userId });
    
    if (!userData) {
      // Create new user if doesn't exist
      const newUser = {
        telegramId: userId,
        monthlyIncome: 0,
        budgets: [],
        transactions: []
      };
      
      await db.collection('users').insertOne(newUser);
      return res.status(200).json(newUser);
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}