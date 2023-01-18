import { DeleteResult } from 'mongodb'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'
import { commentsRepository } from '../Repositories/comments-repository'

export const commentsService = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    return commentsRepository.getCommentById(id)
  },
  async updateCommentById(id: string, content: string, userId: string): Promise<boolean> {
    return commentsRepository.updateCommentById(id, content, userId)
  },
  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    return commentsRepository.deleteCommentById(id, userId)
  },
  /** ONLY FOR E2E TESTS **/
  async _deleteAllComments(): Promise<DeleteResult> {
    return commentsRepository._deleteAllComments()
  },
  /**             **/
}