import dotenv from 'dotenv'

dotenv.config()

export const settings = {
  PORT: process.env.PORT || 3003,
  CLUSTER_ACCESS_URL: process.env.CLUSTER_ACCESS_URL || 'mongodb://localhost:27017',
  JWT_SECRET: process.env.JWT_SECRET || '123',
}