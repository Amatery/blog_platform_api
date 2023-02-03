import { DeleteResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { blogsCollection, commentsCollection, postsCollection } from '../database/database-config'
import { getCommentPaginationModel } from '../helpers/getCommentPaginationModel'
import { getCommentViewModel } from '../helpers/getCommentViewModel'
import { getPostPaginationModel } from '../helpers/getPostPaginationModel'
import { getPostViewModel } from '../helpers/getPostViewModel'
import { CommentViewModel } from '../models/CommentsModels/CommentViewModel'
import { PaginationCommentModel } from '../models/CommentsModels/PaginationCommentModel'
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel'
import { PostViewModel } from '../models/PostModels/PostViewModel'
import { UserAuthMeViewModel } from '../models/UserModels/UserAuthMeViewModel'


export const postsRepository = {
  async getPosts(
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationPostModel> {
    const totalCount = await postsCollection.countDocuments()
    const pagesCount = Math.ceil(totalCount / pageSize)
    const posts = await postsCollection
      .find({})
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray()
    return getPostPaginationModel(pageSize, pageNumber, pagesCount, totalCount, posts)
  },
  async getPostById(id: string): Promise<PostViewModel | null> {
    const foundPost = await postsCollection.findOne({ id })
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
    const foundBlog = await blogsCollection.findOne({ id: blogId })
    const createdPost: PostViewModel = {
      id: uuidv4(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: foundBlog?.name,
      createdAt: new Date().toISOString(),
    }
    await postsCollection.insertOne(createdPost)
    return getPostViewModel(createdPost)
  },
  async updatePostById(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const updatedPost = await postsCollection.updateOne(
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
    const foundPost = await postsCollection.deleteOne({ id })
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
    const foundPost = await postsCollection.findOne({ id })
    if (foundPost) {
      const totalCount = await commentsCollection.countDocuments({ postId: id })
      const pagesCount = Math.ceil(totalCount / pageSize)
      const comments = await commentsCollection
        .find({ postId: id })
        .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
        .skip(pageSize * (pageNumber - 1))
        .limit(pageSize)
        .toArray()
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
    const foundPost = await postsCollection.findOne({ id })
    if (foundPost) {
      const newComment = {
        id: uuidv4(),
        postId: foundPost.id,
        content,
        userId: user.userId,
        userLogin: user.login,
        createdAt: new Date().toISOString(),
      }
      await commentsCollection.insertOne(newComment)
      return getCommentViewModel(newComment)
    } else {
      return null
    }
  },
  /**             **/

  /** ONLY FOR E2E TESTS **/
  async _deleteAllPosts(): Promise<DeleteResult> {
    return postsCollection.deleteMany({})
  },
  /**             **/
}