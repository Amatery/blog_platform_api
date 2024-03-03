import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { settings } from '../../settings';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';

export const jwtService = {
  async createJWT(user: UserDBViewModel): Promise<string> {
    return jwt.sign({ userId: user.id }, settings.JWT_SECRET, { expiresIn: '1h' });
  },
  async getUserIdByToken(token: string, secret: string): Promise<ObjectId | null> {
    try {
      const result: any = jwt.verify(token, secret);
      return new ObjectId(result.userId)
    } catch (e) {
      return null;
    }
  },
  async createRefreshToken(user: UserDBViewModel, deviceId: string = crypto.randomUUID()): Promise<any> {
    const currentDate = new Date();
    return jwt.sign({
      userId: user.id,
      lastActiveDate: currentDate,
      expireDate: new Date(currentDate.getTime() + 20 * 1000),
      deviceId: deviceId,
    }, settings.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
  },
  async verifyRefreshToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.REFRESH_TOKEN_SECRET);
      return result;
    } catch (e) {
      return false;
    }
  },
};
