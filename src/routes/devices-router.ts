import { Request, Response, Router } from 'express';
import { DeleteResult } from 'mongodb';
import { devicesService } from '../domain/devices-service';
import { STATUS_CODES } from '../helpers/StatusCodes';
import { validateRefreshToken } from '../middlewares/auth-middleware';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';
import { RequestWithParams } from '../types/types';

export const devicesRouter = Router({});


devicesRouter.get('/devices', validateRefreshToken, async (req: Request, res: Response<DeviceViewModel[]>) => {
  const devices = await devicesService.getDevices();
    res.status(STATUS_CODES.OK).json(devices);
  },
);

devicesRouter.delete('/devices', validateRefreshToken, async (req: Request, res: Response<DeleteResult>) => {
  const result = await devicesService.deleteDevices();
  if (result) {
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  }
});

devicesRouter.delete(
  '/devices/:id',
  validateRefreshToken,
  async (req: RequestWithParams<{ deviceId: string }>, res: Response<DeleteResult>) => {
    const { deviceId } = req.params;
    const currentUserId = req.user?.userId;
    const device = await devicesService.getDeviceById(deviceId);
    if (!device) {
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      return;
    }
    if (currentUserId !== device.userId) {
      res.sendStatus(STATUS_CODES.FORBIDDEN);
      return;
    }
    const deletedDevice = await devicesService.deleteDeviceById(deviceId);
    if (!deletedDevice) {
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
  },
);
