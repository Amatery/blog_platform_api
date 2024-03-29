import { NextFunction, Request, Response } from 'express';
import { settings } from '../../settings';
import { jwtService } from '../application/jwt-service';
import { devicesService } from '../domain/devices-service';
import { usersService } from '../domain/users-service';
import { STATUS_CODES } from '../helpers/StatusCodes';
import { usersRepository } from '../repositories/users-repository';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  const token = authorization.split(' ')[1];
  const userId: string | null = await jwtService.getUserIdByToken(token, settings.JWT_SECRET);
  if (userId) {
    req.user = await usersService._getUserAuthModel(userId);
    if (req.user === null) {
      res.sendStatus(STATUS_CODES.UNAUTHORIZED);
      return;
    }
    next();
  } else {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
  }
};


export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  const decodedToken = await jwtService.verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }

  const isTokenExpired = await jwtService.isTokenExpired(refreshToken);

  if (isTokenExpired) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }

  const device = await devicesService.getDeviceByIdAndActiveDate(decodedToken.lastActivateDate, decodedToken.deviceId);
  if (!device) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  // @ts-ignore
  req.user =
    {
      ...req.user,
      userId: decodedToken.userId,
      deviceId: decodedToken.deviceId,
    };
  next();
};


export const isEmailExistsMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const user = await usersRepository.findUserByLoginOrEmail(email);
  if (!user) {
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  }
  next();
};
