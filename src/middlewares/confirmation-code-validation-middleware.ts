import { body } from 'express-validator'
import { usersCollection } from '../database/database-config'

export const confirmationCodeValidationMiddleware = body('code')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .custom(async v => {
    const foundUser = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': v })
    if (foundUser === null) {
      return Promise.reject('Invalid confirmation code')
    }
    if (foundUser.emailConfirmation.isConfirmed) {
      return Promise.reject('This email already confirmed')
    }
    return true
  })