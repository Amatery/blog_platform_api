import { Request, Response, Router } from 'express'
import { jwtService } from '../application/jwt-service'
import { authorizationService } from '../domain/authorization-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware } from '../middlewares/auth-middleware'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { validateLoginOrEmail, validatePassword } from '../middlewares/login-body-validators'
import { LoginInputModel } from '../models/AuthorizationModels/LoginInputModel'
import { LoginSuccessViewModel } from '../models/AuthorizationModels/LoginSuccessViewModel'
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel'
import { RequestWithBody } from '../types/types'

export const authorizationRouter = Router({})


authorizationRouter.post(
  '/login',
  validateLoginOrEmail,
  validatePassword,
  inputValidationMiddleware,
  async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel>) => {
    const {
      loginOrEmail,
      password,
    } = req.body
    const user = await authorizationService.authorize(loginOrEmail, password)
    if (!user) {
      res.sendStatus(STATUS_CODES.UNAUTHORIZED)
      return
    }
    const token = {
      accessToken: await jwtService.createJWT(user),
    }
    res.status(STATUS_CODES.OK).json(token)
  },
)

authorizationRouter.get('/me', authMiddleware, async (req: Request, res: Response<UserAuthMeViewModel>) => {
  if (!req.user) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED)
    return
  }
  res.status(STATUS_CODES.OK).json(req.user)
})