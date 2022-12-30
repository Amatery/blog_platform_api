import { Response, Router } from 'express'
import { postsService } from '../domain/posts-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware } from '../middlewares/auth-middleware'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import {
  validateBlogId,
  validateContent,
  validateShortDescription,
  validateTitle,
} from '../middlewares/posts-body-validators'
import { PaginationPostModel } from '../Models/BlogModels/PaginationPostModel'
import { PostInputModel } from '../Models/PostModels/PostInputModel'
import { PostQueryModel } from '../Models/PostModels/PostQueryModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { URIParamsPostIdModel } from '../Models/PostModels/URIParamsPostIdModel'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'

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
  authMiddleware,
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
  authMiddleware,
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

postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsPostIdModel>, res: Response) => {
  const deletedPost = await postsService.deletePostById(req.params.id)
  if (!deletedPost) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})