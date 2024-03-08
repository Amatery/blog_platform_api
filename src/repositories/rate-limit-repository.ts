import { DeleteResult } from 'mongodb';
import { RateLimitModel } from '../database/schemas';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';

export const rateLimitRepository = {
  async createDocument(document: RateLimitViewModel): Promise<any> {
    return RateLimitModel.create(document);
  },
  async countDocuments(clientIp: string, url: string, tenSecondsAgo: Date): Promise<number> {
    const filter = {
      IP: clientIp,
      URL: url,
      date: { $gte: tenSecondsAgo },
    };
    return RateLimitModel.countDocuments(filter);
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllSessions(): Promise<DeleteResult> {
    return RateLimitModel.deleteMany({});
  },
  /**             **/
};
