import { Response, Router } from 'express'
import { postsService } from '../domain/posts-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware } from '../middlewares/auth-middleware'
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware'
import { validateCommentContent } from '../middlewares/comment-body-validators'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import {
  validateBlogId,
  validateContent,
  validateShortDescription,
  validateTitle,
} from '../middlewares/posts-body-validators'
import { CommentInputModel } from '../models/CommentsModels/CommentInputModel'
import { CommentQueryModel } from '../models/CommentsModels/CommentQueryModel'
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel'
import { PaginationCommentModel } from '../models/CommentsModels/PaginationCommentModel'
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel'
import { PostInputModel } from '../models/PostModels/PostInputModel'
import { PostQueryModel } from '../models/PostModels/PostQueryModel'
import { PostViewModel } from '../models/PostModels/PostViewModel'
import { URIParamsPostIdModel } from '../models/PostModels/URIParamsPostIdModel'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  RequestWithQueryAndParams,
} from '../types/types'

export const postsRouter = Router({})

postsRouter.get('/', async (req: RequestWithQuery<PostQueryModel>, res: Response<PaginationPostModel>) => {
  const {
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 10,
  } = req.query
  const posts = await postsService.getPosts(sortBy, sortDirection, +pageNumber, +pageSize)
  res.status(STATUS_CODES.OK).json(posts)
})

postsRouter.get('/:id', async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostViewModel>) => {
  const foundPost = await postsService.getPostById(req.params.id)
  if (foundPost === null) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.status(STATUS_CODES.OK).json(foundPost)
})

postsRouter.post(
  '/',
  basicAuthMiddleware,
  validateTitle,
  validateShortDescription,
  validateContent,
  validateBlogId,
  inputValidationMiddleware,
  async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const {
      title,
      shortDescription,
      content,
      blogId,
    } = req.body
    const createdPost = await postsService.createPost(title, shortDescription, content, blogId)
    res.status(STATUS_CODES.CREATED).json(createdPost)
  },
)

postsRouter.put(
  '/:id',
  basicAuthMiddleware,
  validateTitle,
  validateShortDescription,
  validateContent,
  validateBlogId,
  inputValidationMiddleware,
  async (req: RequestWithParamsAndBody<URIParamsPostIdModel, PostInputModel>, res: Response) => {
    const { id } = req.params
    const {
      title,
      shortDescription,
      content,
      blogId,
    } = req.body
    const updatedPost = await postsService.updatePostById(id, title, shortDescription, content, blogId)
    if (!updatedPost) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

postsRouter.delete('/:id', basicAuthMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res: Response) => {
  const deletedPost = await postsService.deletePostById(req.params.id)
  if (!deletedPost) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})


/** POST COMMENTS **/
postsRouter.get(
  '/:id/comments',
  async (
    req: RequestWithQueryAndParams<URIParamsPostIdModel, CommentQueryModel>,
    res: Response<PaginationCommentModel>,
  ) => {
    const { id } = req.params
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = req.query
    const foundComments = await postsService.getCommentsByPostId(id, sortBy, sortDirection, +pageNumber, +pageSize)
    if (foundComments === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.status(STATUS_CODES.OK).json(foundComments)
  },
)

postsRouter.post(
  '/:id/comments',
  authMiddleware,
  validateCommentContent,
  inputValidationMiddleware,
  async (req: RequestWithParamsAndBody<URIParamsPostIdModel, CommentInputModel>, res: Response<CommentViewModel>) => {
    const { user } = req
    const { id } = req.params
    const { content } = req.body
    const createdComment = await postsService.createCommentByPostId(id, content, user!)
    if (createdComment === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    return res.status(STATUS_CODES.CREATED).json(createdComment)
  },
)
/**             **/