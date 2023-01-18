import { CommentViewModel } from './CommentViewModel'

export type PaginationCommentModel = {
  /**
   * count of total pages
   * current page
   * items on the pages
   * total count
   * Comments view model
   */
  pagesCount: number | null,
  page: number,
  pageSize: number,
  totalCount: number | null
  items: CommentViewModel[]
}