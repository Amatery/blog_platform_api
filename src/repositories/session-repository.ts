import { InsertOneResult, WithId } from 'mongodb'
import { refreshTokensCollection } from '../database/database-config'
import { RefreshTokenModel } from '../models/RefreshTokenModels/RefreshTokenModel'

export const sessionRepository = {
  async addExpiredRefreshToken(tokenInfo: { userId: string, refreshToken: string }): Promise<InsertOneResult<RefreshTokenModel>> {
    return refreshTokensCollection.insertOne(tokenInfo)
  },
  async findExpiredRefreshToken(refreshToken: string): Promise<WithId<RefreshTokenModel> | null> {
    return refreshTokensCollection.findOne({ refreshToken })
  },
}