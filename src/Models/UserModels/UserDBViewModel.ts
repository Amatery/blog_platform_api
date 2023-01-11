export type UserDBViewModel = {
  /**
   * user ID
   * user login name
   * user email
   * user creation date
   */
  id: string,
  login: string,
  email: string,
  passwordHash: string,
  passwordSalt: string,
  createdAt: string
}