import { body } from 'express-validator'

export const validateCommentContent = body('content')
  .isString()
  .trim()
  .isLength({
    min: 20,
    max: 300,
  })