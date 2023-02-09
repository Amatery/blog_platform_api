import { add } from 'date-fns'
import dotenv from 'dotenv'

dotenv.config()

export const settings = {
  PORT: process.env.PORT || 3003,
  CLUSTER_ACCESS_URL: process.env.CLUSTER_ACCESS_URL || 'mongodb://localhost:27017',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '321',
  PLATFORM_EMAIL: process.env.PLATFORM_EMAIL,
  PLATFORM_EMAIL_PASSWORD: process.env.PLATFORM_EMAIL_PASSWORD,
  PLATFORM_GMAIL_APP_PASSWORD: process.env.PLATFORM_GMAIL_APP_PASSWORD,
  CONFIRMATION_CODE_LINK: process.env.CONFIRMATION_CODE_LINK,
}


export const refreshTokenOptions = {
  httpOnly: true,
  secure: true,
  expires: add(new Date(), {
    seconds: 20,
  }),
}