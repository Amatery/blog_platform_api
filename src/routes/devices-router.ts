import { Request, Response, Router } from 'express';
import { DevicesService } from '../domain/devices-service';
import { STATUS_CODES } from '../helpers/StatusCodes';
import { authMiddleware } from '../middlewares/auth-middleware';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const devicesRouter = Router({});


devicesRouter.get('/devices', authMiddleware, async (req: Request, res: Response<DeviceViewModel[]>) => {
    const devices = await DevicesService.getDevices();
    res.status(STATUS_CODES.OK).json(devices);
  },
);

devicesRouter.delete('/devices', authMiddleware, async (req: Request, res: Response) => {
  const result = await DevicesService.deleteDevices();
  if (result) {
    res.status(STATUS_CODES.NO_CONTENT);
    return;
  }
});

devicesRouter.delete('/devices/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const foundDevice = await DevicesService.deleteDeviceById(id);
  if (!foundDevice) {
    res.status(STATUS_CODES.NOT_FOUND);
    return;
  }
  res.status(STATUS_CODES.NO_CONTENT);
});
