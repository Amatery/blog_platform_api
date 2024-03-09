import { Request, Response, Router } from 'express';
import { refreshTokenOptions } from '../../settings';
import { jwtService } from '../application/jwt-service';
import { authorizationService } from '../domain/authorization-service';
import { devicesService } from '../domain/devices-service';
import { usersService } from '../domain/users-service';
import { STATUS_CODES } from '../helpers/StatusCodes';
import { validateNewPassword, validateRecoveryCode } from '../middlewares/auth-body-validation-middleware';
import { authMiddleware, isEmailExistsMiddleWare, validateRefreshToken } from '../middlewares/auth-middleware';
import { confirmationCodeValidationMiddleware } from '../middlewares/confirmation-code-validation-middleware';
import {
  isEmailCorrectAndConfirmed,
  isEmailOrLoginAlreadyExist,
} from '../middlewares/credentials-validation-middleware';
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware';
import { validateLoginOrEmail, validatePassword } from '../middlewares/login-body-validators';
import { rateLimitMiddleware } from '../middlewares/rate-limit-middleware';
import { validateEmail, validateLogin } from '../middlewares/users-body-validators';
import { AccessTokenInputModel } from '../models/AuthorizationModels/AccessTokenInputModel';
import { LoginInputModel } from '../models/AuthorizationModels/LoginInputModel';
import { LoginSuccessViewModel } from '../models/AuthorizationModels/LoginSuccessViewModel';
import { NewPasswordInputModel } from '../models/AuthorizationModels/NewPasswordInputModel';
import { PasswordRecoveryInputModel } from '../models/AuthorizationModels/PasswordRecoveryInputModel';
import { RegistrationConfirmationInputModel } from '../models/AuthorizationModels/RegistrationConfirmationInputModel';
import { RegistrationInputModel } from '../models/AuthorizationModels/RegistrationInputModel';
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel';
import { RequestWithBody } from '../types/types';

export const authorizationRouter = Router({});


authorizationRouter.post(
  '/registration',
  rateLimitMiddleware,
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
    } = req.body;
    const createdUser = await authorizationService.registration(login, email, password);
    if (createdUser === null) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  },
);
authorizationRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  confirmationCodeValidationMiddleware,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationConfirmationInputModel>, res: Response) => {
    const { code } = req.body;
    const result = await authorizationService.emailConfirmation(code);
    if (!result) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  },
);
authorizationRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  isEmailCorrectAndConfirmed,
  inputValidationMiddleware,
  async (req: RequestWithBody<RegistrationConfirmationInputModel>, res: Response) => {
    const { email } = req.body;
    const result = await authorizationService.resendEmailConfirmation(email);
    if (!result) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  },
);
authorizationRouter.post(
  '/login',
  rateLimitMiddleware,
  validateLoginOrEmail,
  validatePassword,
  inputValidationMiddleware,
  async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel>) => {
    const {
      loginOrEmail,
      password,
    } = req.body;
    const deviceIp = req.ip;
    const deviceTitle = req.headers['user-agent'] || 'default';
    const user = await authorizationService.authorize(loginOrEmail, password);
    if (!user) {
      res.sendStatus(STATUS_CODES.UNAUTHORIZED);
      return;
    }
    const accessToken = await jwtService.createJWTAccessToken(user);
    const refreshToken = await jwtService.createRefreshToken(user);
    await devicesService.createDevice(deviceIp, deviceTitle, refreshToken);
    res.status(STATUS_CODES.OK)
      .cookie('refreshToken', refreshToken, refreshTokenOptions)
      .json(accessToken);
  },
);

authorizationRouter.post(
  '/refresh-token',
  validateRefreshToken,
  async (req: RequestWithBody<AccessTokenInputModel>, res: Response<{ accessToken: string }>) => {
    const {
      userId,
      deviceId,
    } = req.user!;
    const currentRefreshToken = req.cookies.refreshToken;
    await jwtService.createExpiredToken(currentRefreshToken);
    const user = await usersService._getUserDBModel(userId);
    const accessToken = await jwtService.createJWTAccessToken(user!);
    const refreshToken = await jwtService.createRefreshToken(user!, deviceId!);
    const updatedDevice = await devicesService.updateDeviceById(refreshToken);
    if (!updatedDevice) {
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      return;
    }
    res.status(STATUS_CODES.OK)
      .cookie('refreshToken', refreshToken, refreshTokenOptions)
      .json(accessToken);
  },
);

authorizationRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  validateEmail,
  inputValidationMiddleware,
  isEmailExistsMiddleWare,
  async (req: RequestWithBody<PasswordRecoveryInputModel>, res: Response) => {
    const { email } = req.body;
    const result = await authorizationService.updateRecoveryCode(email);
    if (!result) {
      res.sendStatus(STATUS_CODES.NO_CONTENT);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  },
);

authorizationRouter.post(
  '/new-password',
  rateLimitMiddleware,
  validateNewPassword,
  validateRecoveryCode,
  inputValidationMiddleware,
  async (req: RequestWithBody<NewPasswordInputModel>, res: Response) => {
    const { recoveryCode, newPassword } = req.body;
    const result = await authorizationService.updateUserPassword(recoveryCode, newPassword);
    if (!result) {
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  },
);

authorizationRouter.post('/logout', validateRefreshToken, async (req: Request, res: Response) => {
  const { deviceId } = req.user!;
  const { refreshToken } = req.cookies;
  await jwtService.createExpiredToken(refreshToken);
  await devicesService.deleteDeviceById(deviceId!);
  res.clearCookie('refreshToken', refreshTokenOptions);
  res.sendStatus(STATUS_CODES.NO_CONTENT);
  return;
});

authorizationRouter.get('/me', authMiddleware, async (req: Request, res: Response<UserAuthMeViewModel>) => {
  if (!req.user) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  res.status(STATUS_CODES.OK).json(req.user);
});
