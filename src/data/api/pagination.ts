import { GetNextPageParamFunction } from '@tanstack/react-query';

interface PagedResponse {
  nextPage?: string;
}

export const getNextPageParam: GetNextPageParamFunction<any> = function getNextPageParam<T extends PagedResponse>(lastPage: T | unknown) {
  return (lastPage as PagedResponse)?.nextPage;
};
