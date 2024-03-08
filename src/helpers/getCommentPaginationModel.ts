import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';

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
        commentatorInfo: c.commentatorInfo,
        id: c.id,
        postId: c.postId,
        content: c.content,
        createdAt: c.createdAt,
      }
    }),
  }
}
