import { WithId } from 'mongodb';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const getDeviceViewModel = ((device: DeviceViewModel): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.lastActiveDate,
    deviceId: device.deviceId,
  };
});


export const getDeviceDBViewModel = ((device: WithId<DeviceDBViewModel>): DeviceDBViewModel => {
  return {
    deviceId: device.deviceId,
    userId: device.userId,
    lastActiveDate: device.lastActiveDate,
    expireDate: device.expireDate,
    ip: device.ip,
    title: device.title,
  };
});
