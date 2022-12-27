import { body } from 'express-validator'
import { blogsCollection } from '../database/database-config'

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

export const validateBlogId = body('blogId').isString().trim().isLength({ min: 1 }).custom(async v => {
  const foundBlog = await blogsCollection.findOne({ id: v })
  if (!foundBlog) {
    return Promise.reject('BlogId does not exists')
  } else {
    return true
  }
})