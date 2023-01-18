import { DeleteResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'
import { PaginationCommentModel } from '../Models/CommentsModels/PaginationCommentModel'
import { PaginationPostModel } from '../Models/PostModels/PaginationPostModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { UserAuthMeViewModel } from '../Models/UserModels/UserAuthMeViewModel'
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

  /** POST COMMENTS **/
  async getCommentsByPostId(
    id: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationCommentModel> {
    return postsRepository.getCommentsByPostId(id, sortBy, sortDirection, pageNumber, pageSize)
  },
  async createCommentByPostId(id: string, content: string, user: UserAuthMeViewModel): Promise<CommentViewModel> {
    const newComment = {
      id: uuidv4(),
      postId: id,
      content,
      userId: user.userId,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
    }
    return postsRepository.createCommentByPostId(newComment)
  },
  /**             **/

  /** ONLY FOR E2E TESTS **/
  async _deleteAllPosts(): Promise<DeleteResult> {
    return postsRepository._deleteAllPosts()
  },
  /**             **/
}