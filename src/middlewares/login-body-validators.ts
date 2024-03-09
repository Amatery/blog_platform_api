import { body } from 'express-validator';

export const validateLoginOrEmail = body('loginOrEmail')
  .isString()
  .trim()
  .isLength({
    min: 3,
    max: 10,
  })
  .withMessage('Incorrect login or password');

export const validatePassword = body('password')
  .isString()
  .trim()
  .isLength({
    min: 6,
    max: 20,
  })
  .withMessage('Incorrect login or password');

export const validateNewPassword = body('newPassword')
  .notEmpty()
  .isString()
  .trim()
  .isLength({
    min: 6,
    max: 20,
  });
