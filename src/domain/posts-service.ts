import { DeleteResult } from 'mongodb'
import { PaginationPostModel } from '../Models/BlogModels/PaginationPostModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { postsRepository } from '../Repositories/posts-repository'

export const postsService = {
  async getPosts(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationPostModel> {
    return postsRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize)
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    return postsRepository.getPostById(id)
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostViewModel> {
    return postsRepository.createPost(title, shortDescription, content, blogId)
  },
  async updatePostById(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    return postsRepository.updatePostById(id, title, shortDescription, content, blogId)
  },
  async deletePostById(id: string): Promise<boolean> {
    return postsRepository.deletePostById(id)
  },

  /**
   * ONLY FOR E2E TESTS
   */
  async deleteAllPosts(): Promise<DeleteResult> {
    return postsRepository.deleteAllPosts()
  },
  /**
   *
   */
}