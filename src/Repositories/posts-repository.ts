import { DeleteResult } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { blogsCollection, postsCollection } from '../database/database-config'
import { getPostPaginationModel } from '../helpers/getPostPaginationModel'
import { getPostViewModel } from '../helpers/getPostViewModel'
import { PaginationPostModel } from '../Models/PostModels/PaginationPostModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'


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

  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllPosts(): Promise<DeleteResult> {
    return postsCollection.deleteMany({})
  },
  /**
   *
   */

}