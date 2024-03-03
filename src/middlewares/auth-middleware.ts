import { isBefore } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { settings } from '../../settings';
import { jwtService } from '../application/jwt-service';
import { devicesService } from '../domain/devices-service';
import { usersService } from '../domain/users-service';
import { STATUS_CODES } from '../helpers/StatusCodes';

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
  console.log('decodedToken', decodedToken);
  if (!decodedToken) {
    res.sendStatus(401);
    return;
  }
  const device = await devicesService.getDeviceByIdAndActiveDate(decodedToken.lastActivateDate, decodedToken.deviceId);
  if (!device) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  if (decodedToken.iat !== device.lastActiveDate) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  if (isBefore(Date.now(), decodedToken.exp)) {
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
