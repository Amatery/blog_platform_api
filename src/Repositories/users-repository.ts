import { DeleteResult } from 'mongodb'
import { usersCollection } from '../database/database-config'
import { getUserPaginationModel } from '../helpers/getUserPaginationModel'
import { getUserViewModel } from '../helpers/getUserViewModel'
import { PaginationUserModel } from '../Models/UserModels/PaginationUserModel'
import { UserDBViewModel } from '../Models/UserModels/UserDBViewModel'
import { UserViewModel } from '../Models/UserModels/UserViewModel'

export const usersRepository = {
  async getUsers(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationUserModel> {
    const users = await usersCollection.find({
        $or: [
          {
            login: {
              $regex: searchLoginTerm ?? '',
              $options: 'si',
            },
            email: {
              $regex: searchEmailTerm ?? '',
              $options: 'si',
            },
          },
        ],
      })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray()
    const totalDocuments = await usersCollection.countDocuments({})
    const totalItems = searchLoginTerm !== null || searchEmailTerm !== null ? users.length : totalDocuments
    const pagesCount = Math.ceil(totalDocuments / pageSize)
    return getUserPaginationModel(pageSize, pageNumber, pagesCount, totalItems, users)
  },
  async getUserById(id: string): Promise<UserViewModel | null> {
    const foundUser = await usersCollection.findOne({ id })
    return foundUser === null ? null : getUserViewModel(foundUser)
  },
  async createUser(user: UserDBViewModel): Promise<UserViewModel> {
    await usersCollection.insertOne(user)
    return getUserViewModel(user)
  },
  async deleteUserById(id: string): Promise<boolean> {
    const foundUser = await usersCollection.deleteOne({ id })
    return foundUser.deletedCount === 1
  },
  async findUserByLoginOrEmail(credentials: string): Promise<UserDBViewModel | null> {
    return usersCollection.findOne({ $or: [{ email: credentials }, { login: credentials }] })
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllUsers(): Promise<DeleteResult> {
    return usersCollection.deleteMany({})
  },
  /**
   *
   */
}