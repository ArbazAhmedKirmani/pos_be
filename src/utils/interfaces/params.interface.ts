import { SizeType } from '@prisma/client';

export interface QueryRequestParams {
  search: string;
  orderBy: 'desc' | 'asc';
  take: number;
  skip: number;
}

export interface SizeQueryParamInterface extends QueryRequestParams {
  type?: SizeType;
}
