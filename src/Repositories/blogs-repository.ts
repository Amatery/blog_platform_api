import { v4 as uuidv4 } from 'uuid'
import { DeleteResult } from 'mongodb'
import { blogsCollection } from '../database/database-config'
import { getBlogViewModel } from '../helpers/getBlogViewModel'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'


export const blogsRepository = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    const blogs = await blogsCollection.find({}).toArray()
    return blogs.map(b => getBlogViewModel(b))
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne({ id })
    if (foundBlog === null) {
      return null
    } else {
      return getBlogViewModel(foundBlog)
    }
  },
  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
    const createdVideo: BlogViewModel = {
      id: uuidv4(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    }
    await blogsCollection.insertOne(createdVideo)
    return getBlogViewModel(createdVideo)
  },
  async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const foundBlog = await blogsCollection.updateOne(
      { id },
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    )
    return foundBlog.matchedCount === 1
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const foundBlog = await blogsCollection.deleteOne({ id })
    return foundBlog.deletedCount === 1
  },

  /**
   * ONLY FOR E2E TESTS
   */
  async deleteAllBlogs(): Promise<DeleteResult> {
    return blogsCollection.deleteMany({})
  },
  /**
   *
   */

}