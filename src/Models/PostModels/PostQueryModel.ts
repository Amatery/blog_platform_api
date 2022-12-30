export type PostQueryModel = {
  /**
   * id of specific blog
   * sortBy: sort by specific item (Default value : createdAt)
   * sortDirection: sort by Ascending / Descending (Default value: desc)
   * pageNumber: pageNumber is number of portions that should be returned (Default value : 1)
   * pageSize: pageSize is portions size that should be returned (Default value : 10)
   */
  id: string,
  searchNameTerm: string | null,
  sortBy: string | 'createdAt',
  sortDirection: 'asc' | 'desc',
  pageNumber: number | 1,
  pageSize: number | 10,
}