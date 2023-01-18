import { UserDBViewModel } from '../Models/UserModels/UserDBViewModel'
import { usersRepository } from '../Repositories/users-repository'

export const authorizationService = {
  async authorize(loginOrEmail: string): Promise<UserDBViewModel | null> {
    return usersRepository.findUserByLoginOrEmail(loginOrEmail)
  },
}