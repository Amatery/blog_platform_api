import { Response, Router } from 'express'
import { body } from 'express-validator'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { URIParamsBlogIdModel } from '../Models/BlogModels/URIParamsBlogIdModel'
import { PostInputModel } from '../Models/PostModels/PostInputModel'
import { PostQueryModel } from '../Models/PostModels/PostQueryModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { URIParamsPostIdModel } from '../Models/PostModels/URIParamsPostIdModel'
import { postsRepository } from '../Models/Repositories/posts-repository'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'

export const postsRouter = Router({})

const validateTitle = body('title')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 30,
  })

const validateShortDescription = body('shortDescription')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 100,
  })

const validateContent = body('content')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 1000,
  })

const validateBlogId = body('blogId').isString().trim().isLength({ min: 1 })


postsRouter.get('/', (req: RequestWithQuery<PostQueryModel>, res: Response<PostViewModel[]>) => {
  const posts = postsRepository.getAllPosts()
  res.status(STATUS_CODES.OK).json(posts)
})

postsRouter.get('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<PostViewModel>) => {
  const foundPost = postsRepository.getPostById(req.params.id)
  if (!foundPost) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.status(STATUS_CODES.OK).json(foundPost)
})

postsRouter.post(
  '/',
  validateTitle,
  validateShortDescription,
  validateContent,
  validateBlogId,
  inputValidationMiddleware,
  (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const createdPost = postsRepository.createPost(title, shortDescription, content, blogId)
    res.status(STATUS_CODES.CREATED).json(createdPost)
  },
)

postsRouter.put(
  '/:id',
  validateTitle,
  validateShortDescription,
  validateContent,
  validateBlogId,
  inputValidationMiddleware,
  (req: RequestWithParamsAndBody<URIParamsPostIdModel, PostInputModel>, res: Response) => {
    const id = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const updatedPost = postsRepository.updatePostById(id, title, shortDescription, content, blogId)
    if (!updatedPost) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

postsRouter.delete('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
  const deletedPost = postsRepository.deletePostById(req.params.id)
  if (!deletedPost) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})