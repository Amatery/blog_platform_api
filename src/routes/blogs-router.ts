import { Response, Router } from 'express'
import { blogsService } from '../domain/blogs-service'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware'
import { validateDescription, validateName, validateWebsiteUrl } from '../middlewares/blogs-body-validators'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import {
  validateContent,
  validateShortDescription,
  validateTitle,
} from '../middlewares/posts-body-validators'
import { BlogInputModel } from '../models/BlogModels/BlogInputModel'
import { BlogQueryModel } from '../models/BlogModels/BlogQueryModel'
import { BlogViewModel } from '../models/BlogModels/BlogViewModel'
import { PaginationBlogModel } from '../models/BlogModels/PaginationBlogModel'
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel'
import { URIParamsBlogIdModel } from '../models/BlogModels/URIParamsBlogIdModel'
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


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: RequestWithQuery<BlogQueryModel>, res: Response<PaginationBlogModel>) => {
  const {
    searchNameTerm = null,
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pageNumber = 1,
    pageSize = 10,
  } = req.query
  const blogs = await blogsService.getBlogs(searchNameTerm, sortBy, sortDirection, +pageNumber, +pageSize)
  res.status(STATUS_CODES.OK).json(blogs)
})

blogsRouter.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel>) => {
  const foundBlog = await blogsService.getBlogById(req.params.id)
  if (foundBlog === null) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.status(STATUS_CODES.OK).json(foundBlog)
})

blogsRouter.post(
  '/',
  basicAuthMiddleware,
  validateName,
  validateDescription,
  validateWebsiteUrl,
  inputValidationMiddleware,
  async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const {
      name,
      description,
      websiteUrl,
    } = req.body
    const createdVideo = await blogsService.createBlog(name, description, websiteUrl)
    res.status(STATUS_CODES.CREATED).json(createdVideo)
  },
)

blogsRouter.put(
  '/:id',
  basicAuthMiddleware,
  validateName,
  validateDescription,
  validateWebsiteUrl,
  inputValidationMiddleware,
  async (req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogInputModel>, res: Response) => {
    const { id } = req.params
    const {
      name,
      description,
      websiteUrl,
    } = req.body
    const updatedVideo = await blogsService.updateBlogById(id, name, description, websiteUrl)
    if (!updatedVideo) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

blogsRouter.delete('/:id', basicAuthMiddleware, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
  const deletedVideo = await blogsService.deleteBlogById(req.params.id)
  if (!deletedVideo) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})

blogsRouter.get(
  '/:id/posts',
  async (
    req: RequestWithQueryAndParams<URIParamsPostIdModel, PostQueryModel>,
    res: Response<PaginationPostModel>,
  ) => {
    const blogId = req.params.id
    const {
      searchNameTerm = null,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = req.query

    const foundBlogPosts = await blogsService.findPostsByBlogId(
      blogId,
      searchNameTerm,
      sortBy,
      sortDirection,
      +pageNumber,
      +pageSize,
    )
    if (foundBlogPosts === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.status(STATUS_CODES.OK).json(foundBlogPosts)
  },
)

blogsRouter.post(
  '/:id/posts',
  basicAuthMiddleware,
  validateTitle,
  validateShortDescription,
  validateContent,
  inputValidationMiddleware,
  async (req: RequestWithParamsAndBody<URIParamsPostIdModel, PostInputModel>, res: Response<PostViewModel>) => {
    const blogId = req.params.id
    const {
      title,
      shortDescription,
      content,
    } = req.body
    const createdPost = await blogsService.createPostByBlogId(blogId, title, shortDescription, content)
    if (createdPost === null) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.status(STATUS_CODES.CREATED).json(createdPost)
  },
)
