import { DeleteResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { blogsRepository } from '../Repositories/blogs-repository'

export const blogsService = {
  async getBlogs(): Promise<BlogViewModel[]> {
    return blogsRepository.getBlogs()
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    return blogsRepository.getBlogById(id)
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
    const newBlog: BlogViewModel = {
      id: uuidv4(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    }
    return blogsRepository.createBlog(newBlog)
  },
  async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return blogsRepository.updateBlogById(id, name, description, websiteUrl)
  },
  async deleteBlogById(id: string): Promise<boolean> {
    return blogsRepository.deleteBlogById(id)
  },

  /**
   * ONLY FOR E2E TESTS
   */
  async deleteAllBlogs(): Promise<DeleteResult> {
    return blogsRepository.deleteAllBlogs()
  },
  /**
   *
   */

}