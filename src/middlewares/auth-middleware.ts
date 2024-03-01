import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { settings } from '../../settings';
import { jwtService } from '../application/jwt-service';
import { DevicesService } from '../domain/devices-service';
import { usersService } from '../domain/users-service';
import { STATUS_CODES } from '../helpers/StatusCodes';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  const token = authorization.split(' ')[1];
  const userId: ObjectId | null = await jwtService.getUserIdByToken(token, settings.JWT_SECRET);
  if (userId) {
    req.user = await usersService._getUserByMongoId(userId);
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
    res.sendStatus(401);
    return;
  }
  const device = await DevicesService.getDeviceByIdAndActiveDate(decodedToken.lastActivateDate, decodedToken.deviceId);
  const userId = await jwtService.getUserIdByToken(refreshToken, settings.REFRESH_TOKEN_SECRET);
  if (!userId || !device) {
    res.sendStatus(STATUS_CODES.UNAUTHORIZED);
    return;
  }
  req.user = await usersService._getUserByMongoId(userId);
  req.deviceId = decodedToken.deviceId;
  next();
};
