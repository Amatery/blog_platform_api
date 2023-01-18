import { DeleteResult, ObjectId } from 'mongodb'
import { PaginationUserModel } from '../Models/UserModels/PaginationUserModel'
import { UserAuthMeViewModel } from '../Models/UserModels/UserAuthMeViewModel'
import { UserViewModel } from '../Models/UserModels/UserViewModel'
import { usersRepository } from '../Repositories/users-repository'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export const usersService = {
  async getUsers(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationUserModel> {
    return usersRepository.getUsers(
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    )
  },
  async getUserById(id: string): Promise<UserViewModel | null> {
    return usersRepository.getUserById(id)
  },
  async _getUserByMongoId(id: ObjectId): Promise<UserAuthMeViewModel | null>{
    return usersRepository._getUserByMongoId(id)
  },
  async createUser(login: string, password: string, email: string): Promise<UserViewModel> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)
    const newUser = {
      id: uuidv4(),
      login,
      passwordHash,
      passwordSalt,
      email,
      createdAt: new Date().toISOString(),
    }
    return usersRepository.createUser(newUser)
  },
  async deleteUserById(id: string) {
    return usersRepository.deleteUserById(id)
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  },
  /** ONLY FOR E2E TESTS **/
  async _deleteAllUsers(): Promise<DeleteResult> {
    return usersRepository._deleteAllUsers()
  },
  /**             **/
}