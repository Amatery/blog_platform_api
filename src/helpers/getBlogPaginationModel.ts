import { BlogViewModel } from '../models/BlogModels/BlogViewModel'
import { PaginationBlogModel } from '../models/BlogModels/PaginationBlogModel'

export const getBlogPaginationModel = (
  pageSize: number,
  page: number,
  pagesCount: number,
  totalCount: number,
  blogs: BlogViewModel[],
): PaginationBlogModel => {
  return {
    page,
    pagesCount,
    pageSize,
    totalCount,
    items: blogs.map(b => {
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
      }
    }),
  }
}