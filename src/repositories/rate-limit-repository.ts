import { rateLimitCollection } from '../database/database-config';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';

export const RateLimitRepository = {
  async createDocument(document: RateLimitViewModel): Promise<any> {
    return rateLimitCollection.insertOne(document);
  },
  async countDocuments(clientIp: string, url: string, tenSecondsAgo: Date): Promise<number> {
    const filter = {
      IP: clientIp,
      URL: url,
      date: { $gte: tenSecondsAgo },
    };
    const count = await rateLimitCollection.countDocuments(filter);
    console.log('count', count);
    return count;
  },
};
