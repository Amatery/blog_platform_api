import { Response, Router } from 'express'
import { usersService } from '../domain/users-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { validateEmail, validateLogin, validatePassword } from '../middlewares/users-body-validators'
import { PaginationUserModel } from '../Models/UserModels/PaginationUserModel'
import { URIParamsUserIdModel } from '../Models/UserModels/URIParamsUserIdModel'
import { UserInputModel } from '../Models/UserModels/UserInputModel'
import { UserQueryModel } from '../Models/UserModels/UserQueryModel'
import { UserViewModel } from '../Models/UserModels/UserViewModel'
import { RequestWithBody, RequestWithParams, RequestWithQuery } from '../types'

export const usersRouter = Router({})


usersRouter.get(
  '/', async (req: RequestWithQuery<UserQueryModel>, res: Response<PaginationUserModel>) => {
    const {
      searchLoginTerm = null,
      searchEmailTerm = null,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = req.query
    const users = await usersService.getUsers(
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      +pageNumber,
      +pageSize,
    )
    res.status(200).json(users)
  },
)

usersRouter.get(
  '/:id',
  basicAuthMiddleware,
  async (req: RequestWithParams<URIParamsUserIdModel>, res: Response<UserViewModel>) => {
    const { id } = req.params
    const foundUser = await usersService.getUserById(id)
    if (foundUser === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.status(STATUS_CODES.OK).json(foundUser)
  },
)

usersRouter.post(
  '/',
  basicAuthMiddleware,
  validateLogin,
  validateEmail,
  validatePassword,
  inputValidationMiddleware,
  async (req: RequestWithBody<UserInputModel>, res: Response<UserViewModel>) => {
    const {
      login,
      password,
      email,
    } = req.body
    const createdUser = await usersService.createUser(login, password, email)
    res.status(STATUS_CODES.CREATED).json(createdUser)
  },
)

usersRouter.delete('/:id', basicAuthMiddleware,
  async (req: RequestWithParams<URIParamsUserIdModel>, res: Response) => {
    const { id } = req.params
    const deletedUser = await usersService.deleteUserById(id)
    if (!deletedUser) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)