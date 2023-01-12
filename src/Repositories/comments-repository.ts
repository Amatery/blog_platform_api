import { commentsCollection } from '../database/database-config'
import { getCommentViewModel } from '../helpers/getCommentViewModel'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const commentsRepository = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const foundComment = await commentsCollection.findOne({ id })
    return foundComment !== null ? getCommentViewModel(foundComment) : null
  },
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const updatedComment = await commentsCollection.updateOne({ id }, { $set: { content } })
    return updatedComment.matchedCount === 1
  },
  async deleteCommentById(id: string): Promise<boolean> {
    const deletedComment = await commentsCollection.deleteOne({ id })
    return deletedComment.deletedCount === 1
  },
}