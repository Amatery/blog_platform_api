import { WithId } from 'mongodb';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const getDeviceViewModel = ((device: WithId<DeviceViewModel>): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActivateDate: device.lastActivateDate,
    deviceId: device.deviceId,
  };
});
