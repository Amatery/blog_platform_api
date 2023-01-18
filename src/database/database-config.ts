import { MongoClient } from 'mongodb'
import { settings } from '../../settings'
import { BlogViewModel } from '../Models/BlogModels/BlogViewModel'
import { CommentViewModel } from '../Models/CommentsModels/CommentViewModel'
import { PostViewModel } from '../Models/PostModels/PostViewModel'
import { UserDBViewModel } from '../Models/UserModels/UserDBViewModel'


const client = new MongoClient(settings.CLUSTER_ACCESS_URL)
export const blogsCollection = client.db().collection<BlogViewModel>('blogs')
export const postsCollection = client.db().collection<PostViewModel>('posts')
export const usersCollection = client.db().collection<UserDBViewModel>('users')
export const commentsCollection = client.db().collection<CommentViewModel>('comments')

export const connectDB = async () => {
  try {
    await client.connect()
    console.log('✅ Connected successfully to cluster')
  } catch (e) {
    console.log(`👎 Something went wrong ${e}`)
    await client.close()
  }
}