import { DeleteResult } from 'mongodb'
import { commentsCollection, usersCollection } from '../database/database-config'
import { getCommentViewModel } from '../helpers/getCommentViewModel'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const commentsRepository = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const foundComment = await commentsCollection.findOne({ id })
    return foundComment !== null ? getCommentViewModel(foundComment) : null
  },
  async updateCommentById(id: string, content: string, userId: string): Promise<boolean> {
    const foundComment = this.getCommentById(id)
    if (foundComment !== null) {
      const isCommentOwner = await usersCollection.findOne({ id: userId })
      if (isCommentOwner !== null && isCommentOwner.id === userId) {
        const updatedComment = await commentsCollection.updateOne({ id }, { $set: { content } })
        return updatedComment.matchedCount === 1
      } else {
        return false
      }
    } else {
      return false
    }
  },
  async deleteCommentById(id: string, userId: string): Promise<boolean> {
    const foundComment = this.getCommentById(id)
    if (foundComment !== null) {
      const isCommentOwner = await usersCollection.findOne({ id: userId })
      if (isCommentOwner !== null && isCommentOwner.id === userId) {
        const deletedComment = await commentsCollection.deleteOne({ id })
        return deletedComment.deletedCount === 1
      } else {
        return false
      }
    } else {
      return false
    }
  },
  /** ONLY FOR E2E TESTS **/
  async _deleteAllComments(): Promise<DeleteResult> {
    return commentsCollection.deleteMany({})
  },
  /**             **/
}