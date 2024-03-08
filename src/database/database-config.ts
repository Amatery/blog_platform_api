import mongoose from 'mongoose';
import { settings } from '../../settings';


export const connectDB = async () => {
  try {
    await mongoose.connect(settings.CLUSTER_ACCESS_URL);
    console.log('✅ Connected successfully to cluster');
  } catch (e) {
    console.log(`👎 Something went wrong ${e}`);
    await mongoose.disconnect();
  }
};
