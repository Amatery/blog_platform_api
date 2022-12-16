import { getPostViewModel } from '../../helpers/getPostViewModel'
import { PostViewModel } from '../PostModels/PostViewModel'
import { blogs } from './blogs-repository'

export let posts: PostViewModel[] = [
  {
    id: '1',
    title: 'Title 1',
    shortDescription: 'Description 1',
    content: 'Content 1',
    blogId: '1',
    blogName: 'Blog 1',
  },
  {
    id: '2',
    title: 'Title 2',
    shortDescription: 'Description 2',
    content: 'Content 2',
    blogId: '2',
    blogName: 'Blog 2',
  },
  {
    id: '3',
    title: 'Title 3',
    shortDescription: 'Description 3',
    content: 'Content 3',
    blogId: '3',
    blogName: 'Blog 3',
  },
]


export const postsRepository = {
  getAllPosts(): PostViewModel[] {
    return posts.map(p => getPostViewModel(p))
  },
  getPostById(id: string): PostViewModel | undefined {
    return posts.find(p => p.id === id)
  },
  createPost(title: string, shortDescription: string, content: string, blogId: string): PostViewModel {
    const findBlogName = blogs.find(b => b.id === blogId)
    const createdPost: PostViewModel = {
      id: new Date().toISOString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: findBlogName?.name,
    }
    posts.push(createdPost)
    return getPostViewModel(createdPost)
  },
  updatePostById(id: string, title: string, shortDescription: string, content: string, blogId: string) {
    let foundPost = posts.find(p => p.id === id)
    if (!foundPost) {
      return false
    }
    foundPost.title = title
    foundPost.shortDescription = shortDescription
    foundPost.content = content
    foundPost.blogId = blogId
    return true
  },
  deletePostById(id: string) {
    const foundPost = posts.filter(p => p.id === id)
    if (!foundPost.length) {
      return false
    }
    posts = posts.filter(p => p.id !== id)
    return true
  },

  /**
   * ONLY FOR E2E TESTS
   */
  deleteAllPosts(): PostViewModel[] {
    posts = []
    return posts
  },
  /**
   *
   */

}