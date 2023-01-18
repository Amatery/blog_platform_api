import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { STATUS_CODES } from '../helpers/StatusCodes'

export const ownerValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.sendStatus(STATUS_CODES.FORBIDDEN)
    return
  } else {
    next()
  }
}