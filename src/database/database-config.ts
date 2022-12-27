import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'

dotenv.config()
const accessUri = process.env.CLUSTER_ACCESS_URL || 'mongodb://localhost:27017'
const client = new MongoClient(accessUri)
export const blogsCollection = client.db().collection<BlogViewModel>('blogs')
export const postsCollection = client.db().collection<PostViewModel>('posts')

export const connectDB = async () => {
  try {
    await client.connect()
    console.log('✅ Connected successfully to cluster')
  } catch (e) {
    console.log(`👎 Something went wrong ${e}`)
    await client.close()
  }
}