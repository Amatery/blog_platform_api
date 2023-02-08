import { CommentatorInfoViewModel } from './CommentatorInfoViewModel'

export type CommentViewModel = {
  /**
   * commentatorInfo
   * comment id
   * comment content
   * date of creation of comment
   */
  commentatorInfo: CommentatorInfoViewModel,
  id: string,
  content: string,
  createdAt: string
}