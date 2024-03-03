import { Request, Response, Router } from 'express';
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

devicesRouter.delete('/devices', validateRefreshToken, async (req: Request, res: Response) => {
  const result = await devicesService.deleteDevices();
  if (result) {
    res.sendStatus(STATUS_CODES.NO_CONTENT);
    return;
  }
});

devicesRouter.delete(
  '/devices/:id',
  validateRefreshToken,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user?.userId;
    const device = await devicesService.getDeviceById(id);
    if (!device) {
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      return;
    }
    if (currentUserId !== device.userId) {
      res.sendStatus(STATUS_CODES.FORBIDDEN);
      return;
    }
    const deletedDevice = await devicesService.deleteDeviceById(id);
    if (!deletedDevice) {
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT);
  },
);
