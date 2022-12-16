import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { STATUS_CODES } from '../helpers/StatusCodes'

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      errorsMessages: errors.array().map(e => {
        return {
          message: e.msg,
          field: e.param,
        }
      }),
    })
    return
  } else {
    next()
  }
}