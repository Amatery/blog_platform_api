import { DeleteResult } from 'mongodb';
import { CommentModel } from '../database/schemas';
import { getCommentViewModel } from '../helpers/getCommentViewModel';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';

export const commentsRepository = {
  async getCommentById(id: string): Promise<CommentViewModel | null> {
    const foundComment = await CommentModel.findOne({ id });
    return foundComment !== null ? getCommentViewModel(foundComment) : null
  },
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const updatedComment = await CommentModel.updateOne({ id }, { $set: { content } });
    return updatedComment.matchedCount === 1
  },
  async deleteCommentById(id: string): Promise<boolean> {
    const deletedComment = await CommentModel.deleteOne({ id });
    return deletedComment.deletedCount === 1
  },
  /** ONLY FOR E2E TESTS **/
  async _deleteAllComments(): Promise<DeleteResult> {
    return CommentModel.deleteMany({});
  },
  /**             **/
}
