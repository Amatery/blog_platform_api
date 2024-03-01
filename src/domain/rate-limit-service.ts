import { RateLimitRepository } from '../repositories/rate-limit-repository';

export const RateLimitService = {
  async createDocument(clientIp: string, url: string, tenSecondsAgo: Date): Promise<any> {
    const document = {
      IP: clientIp,
      URL: url,
      date: tenSecondsAgo,
    };
    return RateLimitRepository.createDocument(document);
  },
  async countDocuments(clientIp: string, url: string, tenSecondsAgo: Date): Promise<number> {
    return RateLimitRepository.countDocuments(clientIp, url, tenSecondsAgo);
  },
};
