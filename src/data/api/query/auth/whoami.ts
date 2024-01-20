import { useQuery } from '@tanstack/react-query';
import { KeyBase, makeRequest } from '@/data/api/client.ts';
import { buildRequestInit } from '@/data/api/search-params.ts';
import { O5AuthV1ServiceWhoamiRequest, O5AuthV1ServiceWhoamiResponse } from '@/data/types';
import { useSelectedRealmId, useSetRealmId } from '@/context/api-context.ts';
import { useEffect } from 'react';

const WHOAMI_STALE_TIME = 1000 * 60 * 60; // 1 hour

export const WHOAMI_KEY: KeyBase = { scope: 'session', entity: 'detail', service: 'AuthService.Whoami' } as const;

export async function whoAmI(request: O5AuthV1ServiceWhoamiRequest | undefined) {
  return makeRequest<O5AuthV1ServiceWhoamiResponse, O5AuthV1ServiceWhoamiRequest>(...buildRequestInit('GET', '', '/o5-auth/v1/whoami', request));
}

export function useWhoAmI() {
  const selectedRealmId = useSelectedRealmId();
  const setRealmId = useSetRealmId();

  const query = useQuery({
    queryKey: [WHOAMI_KEY],
    queryFn: async () => whoAmI({}),
    staleTime: WHOAMI_STALE_TIME,
  });

  useEffect(() => {
    if (!selectedRealmId && query.data?.realmAccess?.length) {
      setRealmId(query.data?.realmAccess[0].realmId);
    }
  }, [query.data?.realmAccess, selectedRealmId, setRealmId]);

  return query;
}
