import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserAuthMeViewModel | null;
      deviceId: string;
    }
  }
}
