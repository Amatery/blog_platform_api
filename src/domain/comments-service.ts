import { DeleteResult } from 'mongodb'
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel'
import { commentsRepository } from '../repositories/comments-repository'

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
  /** ONLY FOR E2E TESTS **/
  async _deleteAllComments(): Promise<DeleteResult> {
    return commentsRepository._deleteAllComments()
  },
  /**             **/
}