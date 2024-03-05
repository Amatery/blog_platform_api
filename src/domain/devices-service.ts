import { DeleteResult } from 'mongodb';
import { jwtService } from '../application/jwt-service';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';
import { devicesRepository } from '../repositories/devices-repository';

export const devicesService = {
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
    console.log('createDeviceService', 'newDevice', newDevice);
    return devicesRepository.createDevice(newDevice);
  },
  async getDevices(): Promise<DeviceViewModel[]> {
    return devicesRepository.getDevices();
  },
  async getDeviceByIdAndActiveDate(lastActivateDate: Date, deviceId: string): Promise<DeviceViewModel | null> {
    return devicesRepository.getDeviceByIdAndActiveDate(lastActivateDate, deviceId);
  },
  async getDeviceById(deviceId: string): Promise<DeviceDBViewModel | null> {
    return devicesRepository.getDeviceById(deviceId);
  },
  async deleteDevices(deviceId: string): Promise<boolean> {
    return devicesRepository.deleteDevices(deviceId);
  },
  async deleteDeviceById(deviceId: string): Promise<boolean> {
    return devicesRepository.deleteDeviceById(deviceId);
  },
  async updateDeviceById(token: string): Promise<boolean> {
    const {
      deviceId,
      lastActiveDate,
      expireDate,
    } = await jwtService.verifyRefreshToken(token);
    console.log('deviceId in updateDeviceId-service', deviceId);
    return devicesRepository.updateDeviceById(deviceId, lastActiveDate, expireDate);

  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllDevices(): Promise<DeleteResult> {
    return devicesRepository._deleteAllDevices();
  },
  /**             **/
};
