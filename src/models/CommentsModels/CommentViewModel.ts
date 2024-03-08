import { CommentatorInfoViewModel } from './CommentatorInfoViewModel';

export type CommentViewModel = {
  /**
   * commentatorInfo
   * comment id
   * comment content
   * date of creation of comment
   */
  commentatorInfo: CommentatorInfoViewModel,
  id: string,
  postId: string,
  content: string,
  createdAt: string
}
