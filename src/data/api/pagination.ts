import { GetNextPageParamFunction } from '@tanstack/react-query';
import { PsmListV1PageResponse } from '@/data/types';

interface PagedResponse {
  page?: PsmListV1PageResponse;
}

export const getNextPageParam: GetNextPageParamFunction<any> = function getNextPageParam<T extends PagedResponse>(lastPage: T | unknown) {
  return (lastPage as PagedResponse)?.page?.nextToken;
};
