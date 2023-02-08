import { body } from 'express-validator'
import { usersCollection } from '../database/database-config'

export const isEmailOrLoginAlreadyExist = body(['email', 'login'])
  .isString()
  .trim()
  .custom(async v => {
    const foundUser = await usersCollection.findOne({ $or: [{ email: v }, { login: v }] })
    if (foundUser === null) {
      return true
    }
    if (foundUser.email === v) {
      return Promise.reject('This email already exists')
    }
    if (foundUser.login === v) {
      return Promise.reject('This login already exists')
    }
  })

export const isEmailCorrect = body('email')
  .isString()
  .trim()
  .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  .custom(async v => {
    const foundUser = await usersCollection.findOne({ email: v })
    if (foundUser === null) {
      return Promise.reject('Email is incorrect')
    }
    return true
  })
