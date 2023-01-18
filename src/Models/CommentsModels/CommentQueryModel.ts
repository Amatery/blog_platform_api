export type CommentQueryModel = {
  /**
   * id: id of post where comment was left
   * pageNumber: pageNumber is number of portions that should be returned (Default value : 1)
   * pageSize: pageSize is portions size that should be returned (Default value : 10)
   * sortBy: sort by specific item (Default value : createdAt)
   * sortDirection: sort by Ascending / Descending (Default value: desc)
   */
  id: string,
  pageNumber: number | 1,
  pageSize: number | 10,
  sortBy: string | 'createdAt',
  sortDirection: 'asc' | 'desc',
}