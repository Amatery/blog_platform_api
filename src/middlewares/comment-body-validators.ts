import { body } from 'express-validator'

export const validateContent = body('content')
  .isString()
  .trim()
  .isLength({
    min: 20,
    max: 300,
  })