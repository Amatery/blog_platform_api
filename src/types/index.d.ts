import { UserAuthMeViewModel } from '../Models/UserModels/UserAuthMeViewModel'

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAuthMeViewModel | null
    }
  }
}