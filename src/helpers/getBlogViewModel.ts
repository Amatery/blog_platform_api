import { WithId } from 'mongodb'
import { BlogViewModel } from '../models/BlogModels/BlogViewModel'

export const getBlogViewModel = (blog: WithId<BlogViewModel> | BlogViewModel): BlogViewModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
  }
}