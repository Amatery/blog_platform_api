import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const getCommentPaginationModel = (
  pageSize: number,
  page: number,
  pagesCount: number,
  totalCount: number,
  comments: CommentViewModel[],
) => {
  return {
    page,
    pagesCount,
    pageSize,
    totalCount,
    items: comments.map(c => {
      return {
        id: c.id,
        content: c.content,
        userId: c.userId,
        userLogin: c.userLogin,
        createdAt: c.createdAt,
      }
    }),
  }
}