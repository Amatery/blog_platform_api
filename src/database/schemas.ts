import { WithId } from 'mongodb';
import mongoose from 'mongoose';
import { BlogViewModel } from '../models/BlogModels/BlogViewModel';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { ExpiredTokenViewModel } from '../models/ExpiredTokenModels/ExpiredTokenViewModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';

export const BlogSchema = new mongoose.Schema<WithId<BlogViewModel>>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const PostSchema = new mongoose.Schema<WithId<PostViewModel>>({
  id: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const UserSchema = new mongoose.Schema<WithId<UserDBViewModel>>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
});

export const DeviceSchema = new mongoose.Schema<WithId<DeviceDBViewModel>>({
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  lastActiveDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
});

export const RateLimitSchema = new mongoose.Schema<WithId<RateLimitViewModel>>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },

});

export const ExpiredTokenSchema = new mongoose.Schema<WithId<ExpiredTokenViewModel>>({
  token: { type: String, required: true },
});

export const BlogModel = mongoose.model<WithId<BlogViewModel>>('blogs', BlogSchema);
export const PostModel = mongoose.model<WithId<PostViewModel>>('posts', PostSchema);
export const UserModel = mongoose.model<WithId<UserDBViewModel>>('users', UserSchema);
export const DeviceModel = mongoose.model<WithId<DeviceDBViewModel>>('devices', DeviceSchema);
export const RateLimitModel = mongoose.model<WithId<RateLimitViewModel>>('rateLimit', RateLimitSchema);
export const ExpiredTokenModel = mongoose.model<WithId<ExpiredTokenViewModel>>('expiredTokens', ExpiredTokenSchema);


