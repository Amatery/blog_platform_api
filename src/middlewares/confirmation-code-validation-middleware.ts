import { body } from 'express-validator';
import { UserModel } from '../database/schemas';

export const confirmationCodeValidationMiddleware = body('code')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .custom(async v => {
    const foundUser = await UserModel.findOne({ 'emailConfirmation.confirmationCode': v });
    if (foundUser === null) {
      return Promise.reject('Invalid confirmation code')
    }
    if (foundUser.emailConfirmation.isConfirmed) {
      return Promise.reject('This email already confirmed')
    }
    return true
  })
