import { UserViewModel } from '../Models/UserModels/UserViewModel'

export const getUserPaginationModel = (
  pageSize: number,
  page: number,
  pagesCount: number,
  totalCount: number,
  users: UserViewModel[],
) => {
  return {
    pagesCount,
    page,
    pageSize,
    totalCount,
    items: users.map(u => {
      return {
        id: u.id,
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
      }
    }),
  }
}