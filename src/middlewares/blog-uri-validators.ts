import { param } from 'express-validator'
import { blogsCollection } from '../database/database-config'

export const validateBlogIdFromURI = param('id').custom(async v => {
  const foundBlog = await blogsCollection.findOne({ id: v })
  if (!foundBlog) {
    return Promise.reject('BlogId does not exists')
  } else {
    return true
  }
})