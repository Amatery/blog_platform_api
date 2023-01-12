export type CommentViewModel = {
  /**
   * comment id
   * comment content
   * user id who left comment
   * user login who left comment
   * date of creation of comment
   */
  id: string,
  content: string,
  userId: string,
  userLogin: string,
  createdAt: string
}