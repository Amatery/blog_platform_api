import { DeleteResult } from 'mongodb';
import { rateLimitRepository } from '../repositories/rate-limit-repository';

export const rateLimitService = {
  async createDocument(clientIp: string, url: string, tenSecondsAgo: Date): Promise<any> {
    const document = {
      IP: clientIp,
      URL: url,
      date: tenSecondsAgo,
    };
    return rateLimitRepository.createDocument(document);
  },
  async countDocuments(clientIp: string, url: string, tenSecondsAgo: Date): Promise<number> {
    return rateLimitRepository.countDocuments(clientIp, url, tenSecondsAgo);
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllSessions(): Promise<DeleteResult> {
    return rateLimitRepository._deleteAllSessions();
  },
  /**             **/
};
