import { DeleteResult } from 'mongodb';
import { rateLimitCollection } from '../database/database-config';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';

export const rateLimitRepository = {
  async createDocument(document: RateLimitViewModel): Promise<any> {
    return rateLimitCollection.insertOne(document);
  },
  async countDocuments(clientIp: string, url: string, tenSecondsAgo: Date): Promise<number> {
    const filter = {
      IP: clientIp,
      URL: url,
      date: { $gte: tenSecondsAgo },
    };
    return await rateLimitCollection.countDocuments(filter);
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllSessions(): Promise<DeleteResult> {
    return rateLimitCollection.deleteMany({});
  },
  /**             **/
};
