import { NextFunction, Request, Response } from 'express'
import { STATUS_CODES } from '../helpers/StatusCodes'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = {
    login: 'admin',
    password: 'qwerty',
  }
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  if (login && password && login !== auth.login && password !== auth.password) {
    // Incorrect data
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(STATUS_CODES.UNAUTHORIZED).send('Login or password is incorrect')
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.status(STATUS_CODES.UNAUTHORIZED).send('Authentication required.')
}