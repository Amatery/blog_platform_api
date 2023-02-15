import { InsertOneResult, WithId } from 'mongodb'
import { usedRefreshTokensCollection } from '../database/database-config'
import { UsedRefreshTokenModel } from '../models/UsedRefreshTokenModels/UsedRefreshTokenModel'

export const usedRefreshTokensRepository = {
  async addExpiredRefreshToken(tokenInfo: { userId: string, refreshToken: string }): Promise<InsertOneResult<UsedRefreshTokenModel>> {
    return usedRefreshTokensCollection.insertOne(tokenInfo)
  },
  async findExpiredRefreshToken(refreshToken: string): Promise<WithId<UsedRefreshTokenModel> | null> {
    return usedRefreshTokensCollection.findOne({ refreshToken })
  },
}