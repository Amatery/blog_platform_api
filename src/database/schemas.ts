import { WithId } from 'mongodb';
import { model, Schema } from 'mongoose';
import { BlogViewModel } from '../models/BlogModels/BlogViewModel';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';
import { DeviceDBViewModel } from '../models/DeviceModels/DeviceDBViewModel';
import { ExpiredTokenViewModel } from '../models/ExpiredTokenModels/ExpiredTokenViewModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';
import { RateLimitViewModel } from '../models/RateLimitModels/RateLimitViewModel';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';

export const BlogSchema = new Schema<WithId<BlogViewModel>>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const PostSchema = new Schema<WithId<PostViewModel>>({
  id: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  title: { type: String, required: true },
});

export const CommentSchema = new Schema<WithId<CommentViewModel>>({
  id: { type: String, required: true },
  postId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
});

export const UserSchema = new Schema<WithId<UserDBViewModel>>({
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

export const DeviceSchema = new Schema<WithId<DeviceDBViewModel>>({
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  lastActiveDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
});

export const RateLimitSchema = new Schema<WithId<RateLimitViewModel>>({
  IP: { type: String, required: true },
  URL: { type: String, required: true },
  date: { type: Date, required: true },

});

export const ExpiredTokenSchema = new Schema<WithId<ExpiredTokenViewModel>>({
  token: { type: String, required: true },
});

export const BlogModel = model<WithId<BlogViewModel>>('blogs', BlogSchema);
export const PostModel = model<WithId<PostViewModel>>('posts', PostSchema);
export const CommentModel = model<WithId<CommentViewModel>>('comments', CommentSchema);
export const UserModel = model<WithId<UserDBViewModel>>('users', UserSchema);
export const DeviceModel = model<WithId<DeviceDBViewModel>>('devices', DeviceSchema);
export const RateLimitModel = model<WithId<RateLimitViewModel>>('rateLimit', RateLimitSchema);
export const ExpiredTokenModel = model<WithId<ExpiredTokenViewModel>>('expiredTokens', ExpiredTokenSchema);


