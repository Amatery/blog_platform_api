import { PaginationPostModel } from '../models/PostModels/PaginationPostModel'
import { PostViewModel } from '../models/PostModels/PostViewModel'

export const getPostPaginationModel = (
  pageSize: number,
  page: number,
  pagesCount: number,
  totalCount: number,
  posts: PostViewModel[],
): PaginationPostModel => {
  return {
    pagesCount,
    page,
    pageSize,
    totalCount,
    items: posts.map(p => {
      return {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
      }
    }),
  }
}