import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel'
import { UserViewModel } from '../models/UserModels/UserViewModel'

export const getUserAuthMeViewModel = (u: UserViewModel): UserAuthMeViewModel => {
  return {
    email: u.email,
    login: u.login,
    userId: u.id,
  }
}