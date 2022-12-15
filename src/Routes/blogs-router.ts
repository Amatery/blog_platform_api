import { Response, Router } from 'express'
import { body } from 'express-validator'
import { STATUS_CODES } from '../helpers/StatusCodes'
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware'
import { BlogInputModel } from '../Models/BlogModels/BlogInputModel'
import { BlogQueryModel } from '../Models/BlogModels/BlogQueryModel'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { URIParamsBlogIdModel } from '../Models/BlogModels/URIParamsBlogIdModel'
import { blogsRepository } from '../Models/Repositories/blogs-repository'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../types'

const checkUrlWithRegExp = new RegExp('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')

export const blogsRouter = Router({})

const validateName = body('name')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 15,
  })
const validateDescription = body('description')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 500,
  })

const validateWebsiteUrl = body('websiteUrl').isString().trim().matches(checkUrlWithRegExp)


blogsRouter.get('/', (req: RequestWithQuery<BlogQueryModel>, res: Response<BlogViewModel[]>) => {
  const blogs = blogsRepository.getAllBlogs()
  res.status(STATUS_CODES.OK).json(blogs)
})

blogsRouter.get('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogViewModel>) => {
  const foundBlog = blogsRepository.getBlogById(req.params.id)
  if (!foundBlog) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
  }
  res.status(STATUS_CODES.OK).json(foundBlog)
})

blogsRouter.post(
  '/',
  validateName,
  validateDescription,
  validateWebsiteUrl,
  inputValidationMiddleware,
  (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl
    const createdVideo = blogsRepository.createBlog(name, description, websiteUrl)
    res.status(STATUS_CODES.CREATED).json(createdVideo)
  },
)

blogsRouter.put(
  '/:id',
  validateName,
  validateDescription,
  validateWebsiteUrl,
  inputValidationMiddleware,
  (req: RequestWithParamsAndBody<URIParamsBlogIdModel, BlogInputModel>, res: Response) => {
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl
    const updatedVideo = blogsRepository.updateBlogById(id, name, description, websiteUrl)
    if (!updatedVideo) {
      res.sendStatus(STATUS_CODES.NOT_FOUND)
      return
    }
    res.sendStatus(STATUS_CODES.NO_CONTENT)
  },
)

blogsRouter.delete('/:id', (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
  const deletedVideo = blogsRepository.deleteBlogById(req.params.id)
  if (!deletedVideo) {
    res.sendStatus(STATUS_CODES.NOT_FOUND)
    return
  }
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
