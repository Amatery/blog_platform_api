import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';
import { DevicesRepository } from '../repositories/devices-repository';

export const DevicesService = {
  async getDevices(): Promise<DeviceViewModel[]> {
    return DevicesRepository.getDevices();
  },
  async deleteDevices(): Promise<boolean> {
    return DevicesRepository.deleteDevices();
  },
  async deleteDeviceById(id: string): Promise<boolean> {
    return DevicesRepository.deleteDeviceById(id);
  },
};
