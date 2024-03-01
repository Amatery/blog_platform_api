import { jwtService } from '../application/jwt-service';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';
import { DevicesRepository } from '../repositories/devices-repository';

export const DevicesService = {
  async createDevice(deviceIp: string, deviceTitle: string, refreshToken: any): Promise<DeviceViewModel> {
    const {
      userId,
      lastActiveDate,
      expireDate,
      deviceId,
    } = await jwtService.verifyRefreshToken(refreshToken);
    const newDevice = {
      deviceId,
      userId,
      lastActiveDate,
      expireDate,
      ip: deviceIp,
      title: deviceTitle,
    };
    return DevicesRepository.createDevice(newDevice);
  },
  async getDevices(): Promise<DeviceViewModel[]> {
    return DevicesRepository.getDevices();
  },
  async getDeviceByIdAndActiveDate(lastActivateDate: Date, deviceId: string): Promise<DeviceViewModel | null> {
    return DevicesRepository.getDeviceByIdAndActiveDate(lastActivateDate, deviceId);
  },
  async deleteDevices(): Promise<boolean> {
    return DevicesRepository.deleteDevices();
  },
  async deleteDeviceById(id: string): Promise<boolean> {
    return DevicesRepository.deleteDeviceById(id);
  },
  async updateDeviceById(token: string): Promise<boolean> {
    const {
      deviceId,
      lastActiveDate,
      expireDate,
    } = await jwtService.verifyRefreshToken(token);
    return DevicesRepository.updateDeviceById(deviceId, lastActiveDate, expireDate);

  },
};
