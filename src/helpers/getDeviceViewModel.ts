import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const getDeviceViewModel = ((device: DeviceViewModel): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.lastActiveDate,
    deviceId: device.deviceId,
  };
});
