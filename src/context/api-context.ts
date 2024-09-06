import { create } from 'zustand';
import { O5RealmV1WhoamiResponseJoinedRealmAccess } from '@/data/types';
import { useO5RealmV1AuthServiceWhoami } from '@/data/api/hooks/generated';
import { useEffect } from 'react';

const WHO_AM_I_STALE_TIME = 1000 * 60 * 60; // 1 hour

export function useWhoAmI() {
  const selectedRealmId = useSelectedRealmId();
  const setRealmId = useSetRealmId();

  const query = useO5RealmV1AuthServiceWhoami({ staleTime: WHO_AM_I_STALE_TIME });

  useEffect(() => {
    if (!selectedRealmId && query.data?.realms?.length) {
      setRealmId(query.data?.realms[0].realm.realmId);
    }
  }, [query.data?.realms, selectedRealmId, setRealmId]);

  return query;
}

interface ApiContextState {
  realmId: string | undefined;
  setRealmId: (realmId: string | undefined) => void;
}

export const useApiContext = create<ApiContextState>((set) => ({
  realmId: '',
  setRealmId: (realmId) => set({ realmId }),
}));

export function useSelectedRealmId() {
  return useApiContext((state) => state.realmId);
}

export function useSetRealmId() {
  return useApiContext((state) => state.setRealmId);
}

export function useSelectedRealm(): [O5RealmV1WhoamiResponseJoinedRealmAccess | undefined, boolean] {
  const realmId = useSelectedRealmId();
  const { data, isPending } = useWhoAmI();

  return [data?.realms?.find((realmAccess) => realmAccess.realm.realmId === realmId), isPending];
}

export function useSelectedRealmBaseUrl(): [string, boolean] {
  const [realmAccess, isLoading] = useSelectedRealm();

  if (import.meta.env.DEV && import.meta.env.VITE_REALM_PROXY_TARGET) {
    return [`${window.location.origin}/apiproxy`, isLoading];
  }

  return [realmAccess?.realm?.data?.spec?.baseUrl || '', isLoading];
}
