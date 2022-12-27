import { Response, Router } from 'express'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { authMiddleware } from '../middlewares/auth-middleware'
import { validateDescription, validateName, validateWebsiteUrl } from '../middlewares/blogs-body-validators'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { BlogInputModel } from '../Models/BlogModels/BlogInputModel'
import { BlogQueryModel } from '../Models/BlogModels/BlogQueryModel'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { URIParamsBlogIdModel } from '../Models/BlogModels/URIParamsBlogIdModel'
import { blogsRepository } from '../Repositories/blogs-repository'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: RequestWithQuery<BlogQueryModel>, res: Response<BlogViewModel[]>) => {
  const blogs = await blogsRepository.getAllBlogs()
  res.status(STATUS_CODES.OK).json(blogs)
})

blogsRouter.get('/:id', async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel>) => {
  const foundBlog = await blogsRepository.getBlogById(req.params.id)
  if (foundBlog === null) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.status(STATUS_CODES.OK).json(foundBlog)
})

blogsRouter.post(
  '/',
  authMiddleware,
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
    const createdVideo = await blogsRepository.createBlog(name, description, websiteUrl)
    res.status(STATUS_CODES.CREATED).json(createdVideo)
  },
)

blogsRouter.put(
  '/:id',
  authMiddleware,
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
    const updatedVideo = await blogsRepository.updateBlogById(id, name, description, websiteUrl)
    if (!updatedVideo) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
  const deletedVideo = await blogsRepository.deleteBlogById(req.params.id)
  if (!deletedVideo) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
