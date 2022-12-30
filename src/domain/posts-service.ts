import { DeleteResult } from 'mongodb'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { postsRepository } from '../Repositories/posts-repository'

export const postsService = {
  async getPosts(): Promise<PostViewModel[]> {
    return postsRepository.getPosts()
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