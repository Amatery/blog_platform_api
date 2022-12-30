import { BlogViewModel } from './BlogViewModel'

export type PaginationBlogModel = {
  /**
   * count of total pages
   * current page
   * items on the pages
   * total count
   */
  pagesCount: number | null,
  page: number,
  pageSize: number,
  totalCount: number | null
  items: BlogViewModel[]
}