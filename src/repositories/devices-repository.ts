import { devicesCollection } from '../database/database-config';
import { getDeviceViewModel } from '../helpers/getDeviceViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const DevicesRepository = {
  async createDevice(device: DeviceViewModel): Promise<DeviceViewModel> {
    await devicesCollection.insertOne(device);
    return getDeviceViewModel(device);
  },
  async getDevices(): Promise<DeviceViewModel[]> {
    const devices = await devicesCollection.find({}).toArray();
    return devices.map(d => getDeviceViewModel(d));
  },
  async getDeviceByIdAndActiveDate(lastActivateDate: Date, deviceId: string): Promise<DeviceViewModel | null> {
    const foundDevice = await devicesCollection.findOne({
      deviceId,
      lastActivateDate,
    });
    return foundDevice !== null ? getDeviceViewModel(foundDevice) : null;
  },
  async deleteDevices(): Promise<boolean> {
    const deletedDevices = await devicesCollection.deleteMany({});
    return deletedDevices.deletedCount > 0;
  },
  async deleteDeviceById(id: string): Promise<boolean> {
    const deletedDevice = await devicesCollection.deleteOne({ id });
    return deletedDevice.deletedCount === 1;
  },
  async updateDeviceById(deviceId: string, lastActiveDate: Date, expireDate: Date): Promise<boolean> {
    const foundDevice = await devicesCollection.findOne({ deviceId });
    if (!foundDevice) {
      return false;
    }
    const updatedDevice = await devicesCollection.updateOne(
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
};
