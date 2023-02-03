import { UserDBViewModel } from '../models/UserModels/UserDBViewModel'
import { usersRepository } from '../repositories/users-repository'
import { usersService } from './users-service'

export const authorizationService = {
  async authorize(loginOrEmail: string, password: string): Promise<UserDBViewModel | null> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (user === null) {
      return null
    }
    const passwordHash = await usersService._generateHash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) {
      return null
    }
    return user
  },
}