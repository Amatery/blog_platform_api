import { InsertOneResult } from 'mongodb';
import { expiredTokensCollection } from '../database/database-config';
import { ExpiredTokenViewModel } from '../models/ExpiredTokenModels/ExpiredTokenViewModel';

export const expiredTokensRepository = {
  async createExpiredToken(token: string): Promise<InsertOneResult> {
    return expiredTokensCollection.insertOne({ token });
  },
  async getExpiredToken(token: string): Promise<ExpiredTokenViewModel | null> {
    return expiredTokensCollection.findOne({ token });
  },
};
