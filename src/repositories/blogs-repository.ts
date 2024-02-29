import { DeleteResult } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { blogsCollection, postsCollection } from '../database/database-config';
import { getBlogPaginationModel } from '../helpers/getBlogPaginationModel';
import { getBlogViewModel } from '../helpers/getBlogViewModel';
import { getPostPaginationModel } from '../helpers/getPostPaginationModel';
import { getPostViewModel } from '../helpers/getPostViewModel';
import { BlogViewModel } from '../models/BlogModels/BlogViewModel';
import { PaginationBlogModel } from '../models/BlogModels/PaginationBlogModel';
import { PaginationPostModel } from '../models/PostModels/PaginationPostModel';
import { PostViewModel } from '../models/PostModels/PostViewModel';

export const blogsRepository = {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationBlogModel> {
    const blogs = await blogsCollection.find({
        name: {
          $regex: searchNameTerm ?? '',
          $options: 'i',
        },
      })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    const totalDocuments = await blogsCollection.countDocuments({});
    const totalItems = searchNameTerm !== null ? blogs.length : totalDocuments;
    const pagesCount = Math.ceil(totalItems / pageSize);
    return getBlogPaginationModel(pageSize, pageNumber, pagesCount, totalItems, blogs);
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne({ id });
    return foundBlog === null ? null : getBlogViewModel(foundBlog);
  },
  async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
    await blogsCollection.insertOne(newBlog);
    return getBlogViewModel(newBlog);
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
    );
    return foundBlog.matchedCount === 1;
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const foundBlog = await blogsCollection.deleteOne({ id });
    return foundBlog.deletedCount === 1;
  },
  async findPostsByBlogId(
    blogId: string,
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationPostModel | null> {
    const totalCount = await postsCollection.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);
    const foundPosts = await postsCollection.find({ blogId })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .toArray();
    return !foundPosts.length ?
      null :
      getPostPaginationModel(pageSize, pageNumber, pagesCount, totalCount, foundPosts);

  },
  async createPostByBlogId(
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostViewModel | null> {
    const foundBlog = await blogsCollection.findOne({ id: blogId });
    if (foundBlog) {
      const createdPost: PostViewModel = {
        id: uuidv4(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: foundBlog.name,
        createdAt: new Date().toISOString(),
      };
      await postsCollection.insertOne(createdPost);
      return getPostViewModel(createdPost);
    } else {
      return null;
    }
  },

  /**
   * ONLY FOR E2E TESTS
   */
  async _deleteAllBlogs(): Promise<DeleteResult> {
    return blogsCollection.deleteMany({});
  },
  /**
   *
   */

};
