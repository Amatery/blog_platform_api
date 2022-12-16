import { body } from 'express-validator'

const checkUrlWithRegExp = new RegExp('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
export const validateName = body('name')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 15,
  })
export const validateDescription = body('description')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 500,
  })

export const validateWebsiteUrl = body('websiteUrl')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 100,
  }).matches(checkUrlWithRegExp)
