import { PostViewModel } from '../PostModels/PostViewModel'

export type PaginationPostModel = {
  pagesCount: number | null,
  page: number,
  pageSize: number,
  totalCount: number | null
  items: PostViewModel[]
}