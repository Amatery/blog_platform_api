import { DevicesCollection } from '../database/database-config';
import { getDeviceViewModel } from '../helpers/getDeviceViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';

export const DevicesRepository = {
  async getDevices(): Promise<DeviceViewModel[]> {
    const devices = await DevicesCollection.find({}).toArray();
    return devices.map(d => getDeviceViewModel(d));
  },
  async deleteDevices(): Promise<boolean> {
    const deletedDevices = await DevicesCollection.deleteMany({});
    return deletedDevices.deletedCount > 0;
  },
  async deleteDeviceById(id: string): Promise<boolean> {
    const deletedDevice = await DevicesCollection.deleteOne({ id });
    return deletedDevice.deletedCount === 1;
  },
};
