import { body } from 'express-validator'

export const validateLogin = body('login')
  .isString()
  .trim()
  .isLength({
    min: 3,
    max: 10,
  })
  .matches('^[a-zA-Z0-9_-]*$')


export const validatePassword = body('password')
  .isString()
  .trim()
  .isLength({
    min: 6,
    max: 20,
  })

export const validateEmail = body('email')
  .isString()
  .trim()
  .isEmail()
  .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')