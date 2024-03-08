import { WithId } from 'mongodb';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';

export const getCommentViewModel = (c: WithId<CommentViewModel> | CommentViewModel): CommentViewModel => {
  return {
    commentatorInfo: c.commentatorInfo,
    id: c.id,
    postId: c.postId,
    content: c.content,
    createdAt: c.createdAt,
  }
}
