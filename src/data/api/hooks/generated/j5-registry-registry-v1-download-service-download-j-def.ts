/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { J5RegistryRegistryV1DownloadServiceDownloadJDefDownloadJDefRequest } from '../../../types/generated';
import { j5RegistryRegistryV1DownloadServiceDownloadJDef } from '../../generated';

/**
 * @generated by NormalizedQueryPlugin (get /registry/v1/:owner/:name/:version/jdef.json) */

export function buildJ5RegistryRegistryV1DownloadServiceDownloadJDefKey(
  request?: J5RegistryRegistryV1DownloadServiceDownloadJDefDownloadJDefRequest,
) {
  return ['j5RegistryRegistryV1DownloadServiceDownloadJDef', 'detail', request] as const;
}

export function useJ5RegistryRegistryV1DownloadServiceDownloadJDef(
  request: J5RegistryRegistryV1DownloadServiceDownloadJDefDownloadJDefRequest | undefined,
  options?: Partial<UseQueryOptions<undefined>>,
) {
  return useQuery({
    queryKey: buildJ5RegistryRegistryV1DownloadServiceDownloadJDefKey(request),
    queryFn: async () => j5RegistryRegistryV1DownloadServiceDownloadJDef('', request),
    enabled: Boolean(request?.owner && request?.name && request?.version),
    ...options,
  });
}
