import { body } from 'express-validator';
import { usersRepository } from '../repositories/users-repository';

export const validateNewPassword = body('newPassword')
  .notEmpty()
  .isString()
  .trim()
  .isLength({
    min: 6,
    max: 20,
  });


export const validateRecoveryCode = body('recoveryCode')
  .isString()
  .notEmpty()
  .custom(async (recoveryCode: string) => {
    const user = await usersRepository.findUserByRecoveryCode(recoveryCode);
    if (!user) {
      throw new Error('Recovery code is incorrect');
    }
    if (user.passwordRecovery.recoveryCode !== recoveryCode && !(user.passwordRecovery.expirationDate > new Date())) {
      throw new Error('Recovery code expired');
    }
    return true;
  }).withMessage('Recovery code is incorrect!');
