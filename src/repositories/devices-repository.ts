import { DeleteResult } from 'mongodb';
import { devicesCollection } from '../database/database-config';
import { getDeviceDBViewModel, getDeviceViewModel } from '../helpers/getDeviceViewModel';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const devicesRepository = {
  async createDevice(device: DeviceDBViewModel): Promise<DeviceViewModel | null> {
    await devicesCollection.insertOne(device);
    const createdDevice = await devicesCollection.findOne({ lastActiveDate: device.lastActiveDate });
    if (!createdDevice) {
      return null;
    }
    return getDeviceViewModel(device);
  },
  async getDevices(): Promise<DeviceViewModel[]> {
    const devices = await devicesCollection.find({}).toArray();
    return devices.map(device => getDeviceViewModel(device));
  },
  async getDeviceByIdAndActiveDate(lastActivateDate: Date, deviceId: string): Promise<DeviceViewModel | null> {
    const foundDevice = await devicesCollection.findOne({
      deviceId: deviceId,
      lastActiveDate: lastActivateDate,
    });
    return foundDevice !== null ? getDeviceViewModel(foundDevice) : null;
  },
  async getDeviceById(deviceId: string): Promise<DeviceDBViewModel | null> {
    const foundDevice = await devicesCollection.findOne({ deviceId: deviceId });
    return foundDevice !== null ? getDeviceDBViewModel(foundDevice) : null;
  },
  async deleteDevices(deviceId: string): Promise<boolean> {
    const deletedDevices = await devicesCollection.deleteMany({ deviceId: { $ne: deviceId } });
    return deletedDevices.deletedCount > 0;
  },
  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const deletedDevice = await devicesCollection.deleteOne({ deviceId });
    return deletedDevice.deletedCount === 1;
  },
  async updateDeviceById(deviceId: string, lastActiveDate: Date, expireDate: Date): Promise<boolean> {
    console.log('updateDeviceById repository', 'deviceId:', deviceId);
    const foundDevice = await devicesCollection.findOne({ deviceId: deviceId });
    if (!foundDevice) {
      return false;
    }
    const updatedDevice = await devicesCollection.updateOne(
      { deviceId: deviceId },
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
    return devicesCollection.deleteMany({});
  },
  /**             **/
};
