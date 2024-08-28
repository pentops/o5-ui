/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { schema } from 'normalizr';
import { o5RealmV1RealmStateEntity } from '../../../entities/generated/o5-realm-v1-realm-state';
import { o5RealmV1TenantStateEntity } from '../../../entities/generated/o5-realm-v1-tenant-state';
import { O5RealmV1AuthServiceWhoamiResponse } from '../../../types/generated';
import { o5RealmV1AuthServiceWhoami } from '../../generated';

export const o5RealmV1AuthServiceWhoamiResponseEntity = new schema.Object<O5RealmV1AuthServiceWhoamiResponse>({
  realms: [
    new schema.Object({
      realm: o5RealmV1RealmStateEntity,
      tenant: o5RealmV1TenantStateEntity,
    }),
  ],
});
/**
 * @generated by NormalizedQueryPlugin (get /o5-auth/v1/whoami) */
export function useO5RealmV1AuthServiceWhoami(options?: Partial<UseQueryOptions<O5RealmV1AuthServiceWhoamiResponse | undefined>>) {
  return useQuery({
    queryKey: ['o5RealmV1AuthServiceWhoami'],
    queryFn: async () => o5RealmV1AuthServiceWhoami(''),
    enabled: true,
    meta: { normalizationSchema: o5RealmV1AuthServiceWhoamiResponseEntity },
    ...options,
  });
}
