import { usersRepository } from '../Repositories/users-repository'
import { usersService } from './users-service'

export const authorizationService = {
  async authorize(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (!user) {
      return false
    }
    const passwordHash = await usersService._generateHash(password, user.passwordSalt)
    return user.passwordHash === passwordHash
  },
}