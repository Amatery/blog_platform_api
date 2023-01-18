import { NextFunction, Request, Response } from 'express'
import { jwtService } from '../application/jwt-service'
import { usersService } from '../domain/users-service'
import { STATUS_CODES } from '../helpers/StatusCodes'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED)
    return
  }
  const token = authorization.split(' ')[1]
  const userId: any = await jwtService.getUserIdByToken(token)
  if (userId) {
    req.user = await usersService._getUserByMongoId(userId)
    if (req.user === null) {
      res.sendStatus(STATUS_CODES.UNAUTHORIZED)
      return
    }
    next()
  } else {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED)
  }
}