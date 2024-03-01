import { MongoClient } from 'mongodb';
import { settings } from '../../settings';
import { BlogViewModel } from '../models/BlogModels/BlogViewModel';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';
import { DeviceViewModel } from '../models/DeviceModels/DeviceViewModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';


const client = new MongoClient(settings.CLUSTER_ACCESS_URL);
export const blogsCollection = client.db().collection<BlogViewModel>('blogs');
export const postsCollection = client.db().collection<PostViewModel>('posts');
export const usersCollection = client.db().collection<UserDBViewModel>('users');
export const commentsCollection = client.db().collection<CommentViewModel>('comments');
export const devicesCollection = client.db().collection<DeviceViewModel>('devices');
export const rateLimitCollection = client.db().collection<RateLimitViewModel>('rateLimit');

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Connected successfully to cluster');
  } catch (e) {
    console.log(`👎 Something went wrong ${e}`);
    await client.close();
  }
};
