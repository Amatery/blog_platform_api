import { Request, Response, Router } from 'express'
import { refreshTokenOptions } from '../../settings'
import { jwtService } from '../application/jwt-service'
import { authorizationService } from '../domain/authorization-service'
import { usersService } from '../domain/users-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware, validateRefreshToken } from '../middlewares/auth-middleware'
import { confirmationCodeValidationMiddleware } from '../middlewares/confirmation-code-validation-middleware'
import {
  isEmailCorrectAndConfirmed,
  isEmailOrLoginAlreadyExist,
} from '../middlewares/credentials-validation-middleware'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { validateLoginOrEmail, validatePassword } from '../middlewares/login-body-validators'
import { validateEmail, validateLogin } from '../middlewares/users-body-validators'
import { AccessTokenInputModel } from '../models/AuthorizationModels/AccessTokenInputModel'
import { LoginInputModel } from '../models/AuthorizationModels/LoginInputModel'
import { LoginSuccessViewModel } from '../models/AuthorizationModels/LoginSuccessViewModel'
import { RegistrationConfirmationInputModel } from '../models/AuthorizationModels/RegistrationConfirmationInputModel'
import { RegistrationInputModel } from '../models/AuthorizationModels/RegistrationInputModel'
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel'
import { RequestWithBody } from '../types/types'

export const authorizationRouter = Router({})


authorizationRouter.post(
  '/registration',
  validateLogin,
  validateEmail,
  validatePassword,
  isEmailOrLoginAlreadyExist,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationInputModel>, res: Response) => {
    const {
      login,
      email,
      password,
    } = req.body
    const createdUser = await authorizationService.registration(login, email, password)
    if (createdUser === null) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)
authorizationRouter.post(
  '/registration-confirmation',
  confirmationCodeValidationMiddleware,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationConfirmationInputModel>, res: Response) => {
    const { code } = req.body
    const result = await authorizationService.emailConfirmation(code)
    if (!result) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)
authorizationRouter.post(
  '/registration-email-resending',
  isEmailCorrectAndConfirmed,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationConfirmationInputModel>, res: Response) => {
    const { email } = req.body
    const result = await authorizationService.resendEmailConfirmation(email)
    if (!result) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)
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
    const accessToken = {
      accessToken: await jwtService.createJWT(user),
    }
    const refreshToken = await jwtService.createRefreshToken(user)
    res.status(STATUS_CODES.OK)
      .cookie('refreshToken', refreshToken, refreshTokenOptions)
      .json(accessToken)
  },
)

authorizationRouter.post(
  '/refresh-token',
  validateRefreshToken,
  async (req: RequestWithBody<AccessTokenInputModel>, res: Response) => {
    const { refreshToken } = req.cookies
    const user = await usersService._getUserDBModel(req.user!.userId)
    await jwtService.addExpiredToken(user!.id, refreshToken)
    const newAccessToken = {
      accessToken: await jwtService.createJWT(user!),
    }
    const newRefreshToken = await jwtService.createRefreshToken(user!)
    res.status(STATUS_CODES.OK)
      .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
      .json(newAccessToken)
  },
)

authorizationRouter.post('/logout', validateRefreshToken, async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  const { user } = req
  await jwtService.addExpiredToken(user!.userId, refreshToken)
  res.clearCookie('refreshToken', refreshTokenOptions)
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})

authorizationRouter.get('/me', authMiddleware, async (req: Request, res: Response<UserAuthMeViewModel>) => {
  if (!req.user) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED)
    return
  }
  res.status(STATUS_CODES.OK).json(req.user)
})