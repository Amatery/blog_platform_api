import bcrypt from 'bcrypt'
import { add } from 'date-fns'
import { SentMessageInfo } from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { emailManager } from '../managers/email-manager'
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel'
import { usersRepository } from '../repositories/users-repository'
import { usersService } from './users-service'

export const authorizationService = {
  async authorize(loginOrEmail: string, password: string): Promise<UserDBViewModel | null> {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (user === null) {
      return null
    }
    const passwordHash = await usersService._generateHash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) {
      return null
    }
    return user
  },
  async registration(login: string, email: string, password: string): Promise<UserDBViewModel | null> {
    const user = await authorizationService.createUser(login, email, password)
    try {
      await emailManager.sendConfirmationMessage(user)
    } catch (e) {
      return null
    }
    return user
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  },
  async emailConfirmation(code: string): Promise<boolean> {
    let user = await usersRepository.findUserByConfirmationCode(code)
    if (!user) {
      return false
    }
    if (user.emailConfirmation.isConfirmed) {
      return false
    }
    if (user.emailConfirmation.confirmationCode !== code) {
      return false
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false
    }
    return usersRepository.updateEmailConfirmation(user.id)
  },
  async resendEmailConfirmation(email: string): Promise<SentMessageInfo | boolean> {
    await usersRepository.generateNewConfirmationCode(email, uuidv4())
    const user = await usersRepository.findUserByLoginOrEmail(email)
    if (user === null) {
      return false
    }
    if (user.emailConfirmation.isConfirmed) {
      return false
    }
    try {
      await emailManager.sendConfirmationMessage(user)
    } catch (e) {
      return false
    }
    return user
  },
  async createUser(login: string, email: string, password: string): Promise<UserDBViewModel> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)
    const newUser = {
      id: uuidv4(),
      login,
      passwordHash,
      passwordSalt,
      email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    }
    await usersRepository.createUser(newUser)
    return newUser
  },
}