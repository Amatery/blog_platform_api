import { WithId } from 'mongodb'
import { UserViewModel } from '../models/UserModels/UserViewModel'

export const getUserViewModel = (user: WithId<UserViewModel> | UserViewModel): UserViewModel => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }
}