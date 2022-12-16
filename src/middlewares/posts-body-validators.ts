import { body } from 'express-validator'
import { blogs } from '../Models/Repositories/blogs-repository'

export const validateTitle = body('title')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 30,
  })

export const validateShortDescription = body('shortDescription')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 100,
  })

export const validateContent = body('content')
  .isString()
  .trim()
  .isLength({
    min: 1,
    max: 1000,
  })

export const validateBlogId = body('blogId').isString().trim().isLength({ min: 1 }).custom(v => {
  const foundBlog = blogs.find(b => b.id === v)
  if (!foundBlog) {
    return Promise.reject('BlogId does not exists')
  } else {
    return true
  }
})