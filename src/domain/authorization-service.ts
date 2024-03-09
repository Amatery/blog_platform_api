import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { randomUUID } from 'node:crypto';
import { SentMessageInfo } from 'nodemailer';
import { emailManager } from '../managers/email-manager';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';
import { usersRepository } from '../repositories/users-repository';
import { usersService } from './users-service';

export const authorizationService = {
  async authorize(loginOrEmail: string, password: string): Promise<UserDBViewModel | null> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (user === null) {
      return null;
    }
    const passwordHash = await usersService._generateHash(password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  },
  async registration(login: string, email: string, password: string): Promise<UserDBViewModel | null> {
    const user = await authorizationService.createUser(login, email, password);
    try {
      await emailManager.sendConfirmationMessage(user);
    } catch (e) {
      return null;
    }
    return user;
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  },
  async emailConfirmation(code: string): Promise<boolean> {
    let user = await usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }
    if (user.emailConfirmation.confirmationCode !== code) {
      return false;
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    return usersRepository.updateEmailConfirmation(user.id);
  },
  async resendEmailConfirmation(email: string): Promise<SentMessageInfo | boolean> {
    await usersRepository.generateNewConfirmationCode(email, randomUUID());
    const user = await usersRepository.findUserByLoginOrEmail(email);
    if (user === null) {
      return false;
    }
    try {
      await emailManager.sendConfirmationMessage(user);
    } catch (e) {
      return false;
    }
    return user;
  },
  async sendRecoveryPasswordEmail(email: string): Promise<boolean | SentMessageInfo> {
    const user = await usersRepository.findUserByLoginOrEmail(email);
    if (!user) {
      return false;
    }
    const updatedRecoveryInfo = {
      recoveryCode: randomUUID(),
      expirationDate: add(new Date(), { minutes: 5 }),
    };
    const updatedRecoveryData = await usersRepository.updateRecoveryCode(
      user.id,
      updatedRecoveryInfo.recoveryCode,
      updatedRecoveryInfo.expirationDate,
    );
    if (!updatedRecoveryData) {
      return false;
    }
    return emailManager.sendRecoveryPassword(user.email, updatedRecoveryInfo.recoveryCode);
  },
  async updateUserPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
    const user = await usersRepository.findUserByRecoveryCode(recoveryCode);
    if (!user) {
      return false;
    }
    if (user.recoveryPassword.recoveryCode !== recoveryCode) {
      return false;
    }
    if (user.recoveryPassword.expirationDate < new Date()) {
      return false;
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);
    return usersRepository.updateUserPassword(user.id, passwordHash, passwordSalt);
  },
  async createUser(login: string, email: string, password: string): Promise<UserDBViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    const newUser = {
      id: randomUUID(),
      login,
      passwordHash,
      passwordSalt,
      email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      recoveryPassword: {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date(), {
          minutes: 5,
        }),
      },
    };
    await usersRepository.createUser(newUser);
    return newUser;
  },
};
