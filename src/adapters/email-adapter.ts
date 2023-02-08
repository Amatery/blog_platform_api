import nodemailer, { SentMessageInfo } from 'nodemailer'
import { settings } from '../../settings'
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: settings.PLATFORM_EMAIL,
    pass: settings.PLATFORM_GMAIL_APP_PASSWORD,
  },
})

export const emailAdapter = {
  async sendConfirmationMessage(user: UserDBViewModel): Promise<SentMessageInfo> {
    return transporter.sendMail({
      from: `Blog platform API <${settings.PLATFORM_EMAIL}>`,
      to: user.email,
      subject: 'Thank you for registration!',
      html: `
        <h1>Thank for your registration!</h1>
       <p>To finish registration please follow the link below:
       <a href='${settings.CONFIRMATION_CODE_LINK}${user.emailConfirmation.confirmationCode}'>complete registration</a>
      </p>`,
    })
  },
}