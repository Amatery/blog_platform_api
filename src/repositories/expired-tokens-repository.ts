import { ExpiredTokenModel } from '../database/schemas';
import { ExpiredTokenViewModel } from '../models/ExpiredTokenModels/ExpiredTokenViewModel';

export const expiredTokensRepository = {
  async createExpiredToken(token: string): Promise<ExpiredTokenViewModel> {
    return ExpiredTokenModel.create({ token });
  },
  async getExpiredToken(token: string): Promise<ExpiredTokenViewModel | null> {
    return ExpiredTokenModel.findOne({ token });
  },
};
