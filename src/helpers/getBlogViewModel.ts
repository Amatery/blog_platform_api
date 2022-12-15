import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'

export const getBlogViewModel = (blog: BlogViewModel): BlogViewModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
  }
}