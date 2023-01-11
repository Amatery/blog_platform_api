import { DeleteResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { PaginationBlogModel } from '../Models/BlogModels/PaginationBlogModel'
import { PaginationPostModel } from '../Models/PostModels/PaginationPostModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { blogsRepository } from '../Repositories/blogs-repository'

export const blogsService = {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationBlogModel> {
    return blogsRepository.getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    return blogsRepository.getBlogById(id)
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
    const newBlog = {
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
  async createPostByBlogId(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostViewModel | null> {
    return blogsRepository.createPostByBlogId(blogId, title, shortDescription, content)
  },
  async findPostsByBlogId(
    blogId: string,
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationPostModel | null> {
    return blogsRepository.findPostsByBlogId(blogId, searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
  },

  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllBlogs(): Promise<DeleteResult> {
    return blogsRepository._deleteAllBlogs()
  },
  /**
   *
   */

}