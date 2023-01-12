import { WithId } from 'mongodb'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const getCommentViewModel = (c: WithId<CommentViewModel> | CommentViewModel): CommentViewModel => {
  return {
    id: c.id,
    content: c.content,
    userId: c.userId,
    userLogin: c.userLogin,
    createdAt: c.createdAt,
  }
}