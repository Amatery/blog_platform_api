import { param } from 'express-validator'
import { commentsService } from '../domain/comments-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'

export const validateCommentOwner = param('id')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .custom(async (v, { req }) => {
    const foundComment: CommentViewModel | null = await commentsService.getCommentById(v)
    if (foundComment === null) {
      return Promise.reject(STATUS_CODES.NOT_FOUND)
    }
    if (foundComment.userId === req.user.id) {
      return true
    } else {
      return Promise.reject(STATUS_CODES.FORBIDDEN)
    }
  })