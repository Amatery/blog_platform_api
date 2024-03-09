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
  async updateRecoveryCode(email: string): Promise<boolean> {
    const data = {
      recoveryCode: randomUUID(),
      expirationDate: add(new Date(), { minutes: 5 }),
    };
    const updatedRecoveryCode = await usersRepository.updateRecoveryCode(email, data.recoveryCode, data.expirationDate);
    await emailManager.sendRecoveryPasswordMessage(email, data.recoveryCode);
    return updatedRecoveryCode;
  },
  async updateUserPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);
    return usersRepository.updateUserPassword(recoveryCode, passwordSalt, passwordHash);
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
      passwordRecovery: {
        recoveryCode: randomUUID(),
        expirationDate: add(new Date, { minutes: 5 }),
      },
    };
    await usersRepository.createUser(newUser);
    return newUser;
  },
};
