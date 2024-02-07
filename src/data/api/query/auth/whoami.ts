import { useQuery } from '@tanstack/react-query';
import { KeyBase } from '@/data/api/client.ts';
import { useSelectedRealmId, useSetRealmId } from '@/context/api-context.ts';
import { useEffect } from 'react';
import { o5AuthV1AuthServiceWhoami } from '@/data/api/generated';

const WHOAMI_STALE_TIME = 1000 * 60 * 60; // 1 hour

export const WHOAMI_KEY: KeyBase = { scope: 'session', entity: 'detail', service: 'AuthService.Whoami' } as const;

export function useWhoAmI() {
  const selectedRealmId = useSelectedRealmId();
  const setRealmId = useSetRealmId();

  const query = useQuery({
    queryKey: [WHOAMI_KEY],
    queryFn: async () => o5AuthV1AuthServiceWhoami('', {}),
    staleTime: WHOAMI_STALE_TIME,
  });

  useEffect(() => {
    if (!selectedRealmId && query.data?.realmAccess?.length) {
      setRealmId(query.data?.realmAccess[0].realmId);
    }
  }, [query.data?.realmAccess, selectedRealmId, setRealmId]);

  return query;
}
