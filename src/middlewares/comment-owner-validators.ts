import { param } from 'express-validator'
import { commentsService } from '../domain/comments-service'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const validateCommentOwner = param('id')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .custom(async (v, { req }) => {
    const foundComment: CommentViewModel | null = await commentsService.getCommentById(v)
    if (foundComment === null || foundComment.userId !== req.user.userId) {
      return Promise.reject('Forbidden')
    } else {
      return true
    }
  })