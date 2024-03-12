import { GetNextPageParamFunction } from '@tanstack/react-query';
import { PsmListV1PageRequest, PsmListV1PageResponse } from '@/data/types';

interface PagedResponse {
  page?: PsmListV1PageResponse;
}

export const getNextPageParam: GetNextPageParamFunction<any> = function getNextPageParam<T extends PagedResponse>(lastPage: T | unknown) {
  return (lastPage as PagedResponse)?.page?.nextToken;
};

export function mergePageParam<T extends { page?: PsmListV1PageRequest }>(request: T | undefined, pageParam?: string) {
  return pageParam ? { ...request, page: { ...request?.page, token: pageParam } } : request;
}
