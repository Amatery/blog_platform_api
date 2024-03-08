import { DeleteResult } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { BlogModel, CommentModel, PostModel } from '../database/schemas';
import { getCommentPaginationModel } from '../helpers/getCommentPaginationModel';
import { getCommentViewModel } from '../helpers/getCommentViewModel';
import { getPostPaginationModel } from '../helpers/getPostPaginationModel';
import { getPostViewModel } from '../helpers/getPostViewModel';
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel';
import { PaginationCommentModel } from '../models/CommentsModels/PaginationCommentModel';
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel';


export const postsRepository = {
  async getPosts(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationPostModel> {
    const totalCount = await PostModel.countDocuments();
    const pagesCount = Math.ceil(totalCount / pageSize)
    const posts = await PostModel
      .find({})
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .lean()
    return getPostPaginationModel(pageSize, pageNumber, pagesCount, totalCount, posts)
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    const foundPost = await PostModel.findOne({ id });
    if (foundPost === null) {
      return null
    } else {
      return getPostViewModel(foundPost)
    }
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostViewModel> {
    const foundBlog = await BlogModel.findOne({ id: blogId });
    const createdPost: PostViewModel = {
      id: uuidv4(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: foundBlog?.name,
      createdAt: new Date().toISOString(),
    }
    await PostModel.create(createdPost);
    return getPostViewModel(createdPost)
  },
  async updatePostById(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const updatedPost = await PostModel.updateOne(
      { id },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId,
        },
      },
    )
    return updatedPost.matchedCount === 1
  },
  async deletePostById(id: string): Promise<boolean> {
    const foundPost = await PostModel.deleteOne({ id });
    return foundPost.deletedCount === 1
  },

  /** POST COMMENTS **/
  async getCommentsByPostId(
    id: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationCommentModel | null> {
    const foundPost = await PostModel.findOne({ id });
    if (foundPost) {
      const totalCount = await CommentModel.countDocuments({ postId: id });
      const pagesCount = Math.ceil(totalCount / pageSize)
      const comments = await CommentModel
        .find({ postId: id })
        .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .lean()
      return getCommentPaginationModel(pageSize, pageNumber, pagesCount, totalCount, comments)
    } else {
      return null
    }
  },
  async createCommentByPostId(
    id: string,
    content: string,
    user: UserAuthMeViewModel,
  ): Promise<CommentViewModel | null> {
    const foundPost = await PostModel.findOne({ id });
    if (foundPost) {
      const newComment = {
        commentatorInfo: {
          userId: user.userId,
          userLogin: user.login,
        },
        id: uuidv4(),
        postId: foundPost.id,
        content,
        createdAt: new Date().toISOString(),
      }
      await CommentModel.create(newComment);
      return getCommentViewModel(newComment)
    } else {
      return null
    }
  },
  /**             **/

  /** ONLY FOR E2E TESTS **/
  async _deleteAllPosts(): Promise<DeleteResult> {
    return PostModel.deleteMany({});
  },
  /**             **/
}
