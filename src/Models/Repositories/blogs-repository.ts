import { getBlogViewModel } from '../../helpers/getBlogViewModel'
import { BlogViewModel } from '../BlogModels/BlogViewModel'

export let blogs: BlogViewModel[] = [
  {
    id: '1',
    name: 'Blog 1',
    description: 'Description 1',
    websiteUrl: 'https://youtube.com',
  },
  {
    id: '2',
    name: 'Blog 2',
    description: 'Description 2',
    websiteUrl: 'https://vimeo.com',
  },
  {
    id: '3',
    name: 'Blog 3',
    description: 'Description 3',
    websiteUrl: 'https://rutube.ru',
  },
]


export const blogsRepository = {
  getAllBlogs(): BlogViewModel[] {
    return blogs.map(b => getBlogViewModel(b))
  },
  getBlogById(id: string): BlogViewModel | undefined {
    return blogs.find(b => b.id === id)
  },
  createBlog(name: string, description: string, websiteUrl: string): BlogViewModel {
    const createdVideo: BlogViewModel = {
      id: new Date().toISOString(),
      name,
      description,
      websiteUrl,
    }
    blogs.push(createdVideo)
    return getBlogViewModel(createdVideo)
  },
  updateBlogById(id: string, name: string, description: string, websiteUrl: string) {
    let foundBlog = blogs.find(b => b.id === id)
    if (!foundBlog) {
      return false
    }
    foundBlog.name = name
    foundBlog.description = description
    foundBlog.websiteUrl = websiteUrl
    return true
  },
  deleteBlogById(id: string) {
    const foundBlog = blogs.filter(b => b.id === id)
    if (!foundBlog.length) {
      return false
    }
    blogs = blogs.filter(b => b.id !== id)
    return true
  },

  /**
   * ONLY FOR E2E TESTS
   */
  deleteAllBlogs(): BlogViewModel[] {
    blogs = []
    return blogs
  },
  /**
   *
   */

}