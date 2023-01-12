import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'
import { commentsRepository } from '../Repositories/comments-repository'

export const commentsService = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    return commentsRepository.getCommentById(id)
  },
  async updateCommentById(id: string, content: string): Promise<boolean> {
    return commentsRepository.updateCommentById(id, content)
  },
  async deleteCommentById(id: string): Promise<boolean> {
    return commentsRepository.deleteCommentById(id)
  },
}