import { Response, Router } from 'express'
import { authorizationService } from '../domain/authorization-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { validateLoginOrEmail, validatePassword } from '../middlewares/login-body-validators'
import { LoginInputModel } from '../Models/AuthorizationModels/LoginInputModel'
import { RequestWithBody } from '../types'

export const authorizationRouter = Router({})


authorizationRouter.post(
  '/login',
  validateLoginOrEmail,
  validatePassword,
  inputValidationMiddleware,
  async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const {
      loginOrEmail,
      password,
    } = req.body
    const authorize = await authorizationService.authorize(loginOrEmail, password)
    if (!authorize) {
      res.sendStatus(STATUS_CODES.UNAUTHORIZED)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)