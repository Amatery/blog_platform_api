import { UserViewModel } from './UserViewModel'

export type PaginationUserModel = {
  /**
   * count of total pages
   * current page
   * items on the pages
   * total count
   * View model of users
   */
  pagesCount: number | null,
  page: number,
  pageSize: number,
  totalCount: number | null
  items: UserViewModel[]
}