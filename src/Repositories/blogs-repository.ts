import { DeleteResult } from 'mongodb'
import { blogsCollection } from '../database/database-config'
import { getBlogViewModel } from '../helpers/getBlogViewModel'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'


export const blogsRepository = {
  async getBlogs(): Promise<BlogViewModel[]> {
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
  async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
    await blogsCollection.insertOne(newBlog)
    return getBlogViewModel(newBlog)
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