import { SentMessageInfo } from 'nodemailer';
import { emailAdapter } from '../adapters/email-adapter';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';

export const emailManager = {
  async sendConfirmationMessage(user: UserDBViewModel): Promise<SentMessageInfo> {
    return emailAdapter.sendConfirmationMessage(user);
  },
  async sendRecoveryPasswordMessage(email: string, recoveryCode: string): Promise<SentMessageInfo> {
    return emailAdapter.sendRecoveryPasswordMessage(email, recoveryCode);
  },
};
