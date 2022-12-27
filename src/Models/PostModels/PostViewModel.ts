export type PostViewModel = {
  /**
   * post id
   * post title
   * post short description
   * post content
   * related blog id
   * name of related blog
   */
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName?: string
  createdAt: string
}