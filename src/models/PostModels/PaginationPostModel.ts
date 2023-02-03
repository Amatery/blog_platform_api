import { PostViewModel } from './PostViewModel'

export type PaginationPostModel = {
  /**
   * count of total pages
   * current page
   * items on the pages
   * total count
   * View model of posts
   */
  pagesCount: number | null,
  page: number,
  pageSize: number,
  totalCount: number | null
  items: PostViewModel[]
}