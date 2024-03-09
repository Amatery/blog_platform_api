import { ObjectId } from 'mongodb';

export type UserDBViewModel = {
  /**
   * mongoId
   * user ID
   * user login name
   * user email
   * user creation date
   */
  _id?: ObjectId
  id: string,
  login: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  createdAt: string
  emailConfirmation: {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
  }
  passwordRecovery: {
    recoveryCode: string,
    expirationDate: Date
  },
}
