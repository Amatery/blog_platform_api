import jwt from 'jsonwebtoken';
import { InsertOneResult } from 'mongodb';
import { randomUUID } from 'node:crypto';
import { settings } from '../../settings';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';
import { expiredTokensRepository } from '../repositories/expired-tokens-repository';

export const jwtService = {
  async createJWTAccessToken(user: UserDBViewModel): Promise<{ accessToken: string }> {
    const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '1h' });
    return {
      accessToken: token,
    };
  },
  async getUserIdByToken(token: string, secret: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, secret);
      return result.userId;
    } catch (e) {
      return null;
    }
  },
  async createRefreshToken(user: UserDBViewModel, deviceId: string = randomUUID()): Promise<any> {
    const currentDate = new Date();
    console.log('createRefreshToken - userId:', user.id, 'deviceId:', deviceId);
    return jwt.sign({
      userId: user.id,
      lastActiveDate: currentDate,
      expireDate: new Date(currentDate.getTime() + 20 * 1000),
      deviceId,
    }, settings.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
  },
  async verifyRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET);
      console.log('result in verifyRefreshToken', result);
      return result;
    } catch (e) {
      return false;
    }
  },
  async createExpiredToken(token: string): Promise<InsertOneResult> {
    return expiredTokensRepository.createExpiredToken(token);
  },
  async isTokenExpired(token: string): Promise<string | null> {
    return expiredTokensRepository.getExpiredToken(token);
  },
};
