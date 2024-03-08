import { DeleteResult } from 'mongodb';
import { DeviceModel } from '../database/schemas';
import { getDeviceDBViewModel, getDeviceViewModel } from '../helpers/getDeviceViewModel';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const devicesRepository = {
  async createDevice(device: DeviceDBViewModel): Promise<DeviceViewModel> {
    await DeviceModel.create(device);
    return getDeviceViewModel(device);
  },
  async getDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices = await DeviceModel.find({ userId }).lean();
    return devices.map(device => getDeviceViewModel(device));
  },
  async getDeviceByIdAndActiveDate(lastActivateDate: Date, deviceId: string): Promise<DeviceViewModel | null> {
    const foundDevice = await DeviceModel.findOne({
      deviceId,
      lastActivateDate,
    });
    return foundDevice !== null ? getDeviceViewModel(foundDevice) : null;
  },
  async getDeviceById(deviceId: string): Promise<DeviceDBViewModel | null> {
    const foundDevice = await DeviceModel.findOne({ deviceId });
    return foundDevice !== null ? getDeviceDBViewModel(foundDevice) : null;
  },
  async deleteDevices(deviceId: string): Promise<boolean> {
    const deletedDevices = await DeviceModel.deleteMany({ deviceId: { $ne: deviceId } });
    return deletedDevices.deletedCount > 0;
  },
  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const deletedDevice = await DeviceModel.deleteOne({ deviceId });
    return deletedDevice.deletedCount === 1;
  },
  async updateDeviceById(deviceId: string, lastActiveDate: Date, expireDate: Date): Promise<boolean> {
    const foundDevice = await DeviceModel.findOne({ deviceId });
    if (!foundDevice) {
      return false;
    }
    const updatedDevice = await DeviceModel.updateOne(
      { deviceId },
      {
        $set: {
          lastActiveDate,
          expireDate,
        },
      },
    );
    return updatedDevice.modifiedCount === 1;
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllDevices(): Promise<DeleteResult> {
    return DeviceModel.deleteMany({});
  },
  /**             **/
};
