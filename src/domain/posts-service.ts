import { DeleteResult } from 'mongodb';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';
import { PaginationCommentModel } from '../models/CommentsModels/PaginationCommentModel';
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel';
import { postsRepository } from '../repositories/posts-repository';


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
  ): Promise<PaginationCommentModel | null> {
    return postsRepository.getCommentsByPostId(id, sortBy, sortDirection, pageNumber, pageSize)
  },
  async createCommentByPostId(
    id: string,
    content: string,
    user: UserAuthMeViewModel,
  ): Promise<CommentViewModel | null> {
    return postsRepository.createCommentByPostId(id, content, user)
  },
  /**             **/

  /** ONLY FOR E2E TESTS **/
  async _deleteAllPosts(): Promise<DeleteResult> {
    return postsRepository._deleteAllPosts()
  },
  /**             **/
}
