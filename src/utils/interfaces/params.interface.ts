export interface QueryRequestParams {
  search: string;
  orderBy: 'desc' | 'asc';
  take: number;
  skip: number;
}
