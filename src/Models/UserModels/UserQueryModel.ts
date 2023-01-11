export type UserQueryModel = {
  /**
   * searchLoginTerm: Search term for user Login: Login should contain this term in any position
   * searchEmailTerm: Search term for user Email: Email should contain this term in any position
   * sortBy: sort by specific item (Default value : createdAt)
   * sortDirection: sort by Ascending / Descending (Default value: desc)
   * pageNumber: pageNumber is number of portions that should be returned (Default value : 1)
   * pageSize: pageSize is portions size that should be returned (Default value : 10)
   */
  id: string,
  searchLoginTerm: string | null,
  searchEmailTerm: string | null,
  sortBy: string | 'createdAt',
  sortDirection: 'asc' | 'desc',
  pageNumber: number | 1,
  pageSize: number | 10,
}
