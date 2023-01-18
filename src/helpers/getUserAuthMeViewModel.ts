import { UserAuthMeViewModel } from '../Models/UserModels/UserAuthMeViewModel'
import { UserViewModel } from '../Models/UserModels/UserViewModel'

export const getUserAuthMeViewModel = (u: UserViewModel): UserAuthMeViewModel => {
  return {
    email: u.email,
    login: u.login,
    userId: u.id,
  }
}