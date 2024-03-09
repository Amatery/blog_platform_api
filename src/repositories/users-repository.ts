import { DeleteResult } from 'mongodb';
import { UserModel } from '../database/schemas';
import { getUserAuthMeViewModel } from '../helpers/getUserAuthMeViewModel';
import { getUserPaginationModel } from '../helpers/getUserPaginationModel';
import { getUserViewModel } from '../helpers/getUserViewModel';
import { PaginationUserModel } from '../models/UserModels/PaginationUserModel';
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel';
import { UserDBViewModel } from '../models/UserModels/UserDBViewModel';
import { UserViewModel } from '../models/UserModels/UserViewModel';

export const usersRepository = {
  async getUsers(
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationUserModel> {
    const users = await UserModel.find({
        $or: [
          {
            $and: [
              {
                login: {
                  $regex: searchLoginTerm ?? '',
                  $options: 'i',
                },
              },
            ],
          },
          {
            $and: [
              {
                email: {
                  $regex: searchEmailTerm ?? '',
                  $options: 'si',
                },
              },
            ],
          },
        ],
      })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean();
    const totalDocuments = await UserModel.countDocuments({});
    const totalItems = searchLoginTerm !== null || searchEmailTerm !== null ? users.length : totalDocuments;
    const pagesCount = Math.ceil(totalDocuments / pageSize);
    return getUserPaginationModel(pageSize, pageNumber, pagesCount, totalItems, users);
  },
  async getUserById(id: string): Promise<UserViewModel | null> {
    const foundUser = await UserModel.findOne({ id });
    return foundUser === null ? null : getUserViewModel(foundUser);
  },
  async _getUserAuthModel(id: string): Promise<UserAuthMeViewModel | null> {
    const foundUser = await UserModel.findOne({ id });
    return foundUser === null ? null : getUserAuthMeViewModel(foundUser);
  },
  async _getUserDBModel(id: string): Promise<UserDBViewModel | null> {
    return UserModel.findOne({ id });
  },
  async createUser(user: UserDBViewModel): Promise<UserViewModel> {
    await UserModel.create(user);
    return getUserViewModel(user);
  },
  async deleteUserById(id: string): Promise<boolean> {
    const foundUser = await UserModel.deleteOne({ id });
    return foundUser.deletedCount === 1;
  },
  async findUserByLoginOrEmail(credentials: string): Promise<UserDBViewModel | null> {
    console.log('findUserByLoginOrEmail credentials', credentials);
    return UserModel.findOne({ $or: [{ email: credentials }, { login: credentials }] });
  },
  async findUserByConfirmationCode(code: string): Promise<UserDBViewModel | null> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  },
  async findUserByRecoveryCode(code: string): Promise<UserDBViewModel | null> {
    return UserModel.findOne({ 'recoveryPassword.recoveryCode': code });
  },
  async updateUserPassword(id: string, passwordHash: string, passwordSalt: string): Promise<boolean> {
    const updatedUser = await UserModel.updateOne({ id }, { $set: { passwordHash, passwordSalt } });
    return updatedUser.modifiedCount === 1;
  },
  async updateEmailConfirmation(id: string): Promise<boolean> {
    const result = await UserModel.updateOne({ id }, { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.modifiedCount === 1;
  },
  async generateNewConfirmationCode(email: string, code: string): Promise<boolean> {
    const result = await UserModel.updateOne({ email }, { $set: { 'emailConfirmation.confirmationCode': code } });
    return result.modifiedCount === 1;
  },
  async updateRecoveryCode(id: string, recoveryCode: string, expirationDate: Date): Promise<boolean> {
    const updatedUser = await UserModel.updateOne(
      { id },
      {
        $set: {
          'recoveryPassword.recoveryCode': recoveryCode,
          'recoveryPassword.expirationDate': expirationDate,
        },
      },
    );
    return updatedUser.modifiedCount === 1;
  },
  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllUsers(): Promise<DeleteResult> {
    return UserModel.deleteMany({});
  },
  /**
   *
   */
};
