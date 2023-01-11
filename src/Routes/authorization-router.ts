import { Response, Router } from 'express'
import { authorizationService } from '../domain/authorization-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { LoginInputModel } from '../Models/AuthorizationModels/LoginInputModel'
import { RequestWithBody } from '../types'

export const authorizationRouter = Router({})


authorizationRouter.post('/login', async (req: RequestWithBody<LoginInputModel>, res: Response) => {
  const {
    loginOrEmail,
    password,
  } = req.body
  const authorize = await authorizationService.authorize(loginOrEmail, password)
  if (!authorize) {
    res.status(STATUS_CODES.UNAUTHORIZED)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})