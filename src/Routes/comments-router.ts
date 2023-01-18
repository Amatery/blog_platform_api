import { Router, Response } from 'express'
import { commentsService } from '../domain/comments-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware } from '../middlewares/auth-middleware'
import { validateCommentContent } from '../middlewares/comment-body-validators'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { CommentInputModel } from '../Models/CommentsModels/CommentInputModel'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'
import { URIParamsCommentIdModel } from '../Models/CommentsModels/URIParamsCommentIdModel'
import { RequestWithParams, RequestWithParamsAndBody } from '../types/types'

export const commentsRouter = Router({})


commentsRouter.get(
  '/:id',
  async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response<CommentViewModel>) => {
    const { id } = req.params
    const foundComment = await commentsService.getCommentById(id)
    if (foundComment === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.status(STATUS_CODES.OK).json(foundComment)
  },
)

commentsRouter.put(
  '/:id',
  authMiddleware,
  validateCommentContent,
  inputValidationMiddleware,
  async (req: RequestWithParamsAndBody<URIParamsCommentIdModel, CommentInputModel>, res: Response) => {
    const { id } = req.params
    const { content } = req.body
    const updatedComment = await commentsService.updateCommentById(id, content)
    if (!updatedComment) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

commentsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response) => {
    const { id } = req.params
    const deletedComment = await commentsService.deleteCommentById(id)
    if (!deletedComment) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

