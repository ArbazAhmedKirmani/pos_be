import { SizeType } from '@prisma/client';

export enum OrderbyType {
  desc = 'desc',
  asc = 'asc',
}

export interface QueryRequestParams {
  search: string;
  orderBy: OrderbyType;
  take: number;
  skip: number;
}

export interface SizeQueryParamInterface extends QueryRequestParams {
  type?: SizeType;
}
