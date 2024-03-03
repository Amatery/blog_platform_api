import { NextFunction, Request, Response } from 'express';
import { rateLimitService } from '../domain/rate-limit-service';

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();
  const tenSecondsAgo = new Date(currentDate.getTime() - 10 * 1000);
  const clientIp = req.ip;
  const count = await rateLimitService.countDocuments(clientIp, req.originalUrl, tenSecondsAgo);
  if (count >= 5) {
    res.sendStatus(429);
    return;
  } else {
    await rateLimitService.createDocument(clientIp, req.originalUrl, currentDate);
    next();
  }
};
