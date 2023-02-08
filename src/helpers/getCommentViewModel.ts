import { WithId } from 'mongodb'
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel'

export const getCommentViewModel = (c: WithId<CommentViewModel> | CommentViewModel): CommentViewModel => {
  return {
    commentatorInfo: c.commentatorInfo,
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
  }
}