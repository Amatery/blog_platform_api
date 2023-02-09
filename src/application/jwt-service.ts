import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { settings } from '../../settings'
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel'
import { sessionRepository } from '../repositories/session-repository'

export const jwtService = {
  async createJWT(user: UserDBViewModel): Promise<string> {
    return jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: 10 })
  },
  async getUserIdByToken(token: string, secret: string) {
    try {
      const result: any = jwt.verify(token, secret)
      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },
  async createRefreshToken(user: UserDBViewModel): Promise<any> {
    return jwt.sign({ userId: user._id }, settings.REFRESH_TOKEN_SECRET, { expiresIn: 20 })
  },
  async addExpiredToken(userId: string, refreshToken: string) {
    const tokenInfo = {
      userId,
      refreshToken,
    }
    return sessionRepository.addExpiredRefreshToken(tokenInfo)
  },
}