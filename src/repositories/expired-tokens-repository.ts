import { InsertOneResult } from 'mongodb';
import { expiredTokensCollection } from '../database/database-config';

export const expiredTokensRepository = {
  async createExpiredToken(token: string): Promise<InsertOneResult> {
    return expiredTokensCollection.insertOne({ token });
  },
  async getExpiredToken(token: string): Promise<string | null> {
    return expiredTokensCollection.findOne({ token });
  },
};
