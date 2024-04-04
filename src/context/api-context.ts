import { create } from 'zustand';
import { useWhoAmI } from '@/data/api';
import { O5AuthV1RealmAccess } from '@/data/types';

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

export function useSelectedRealm(): [O5AuthV1RealmAccess | undefined, boolean] {
  const realmId = useSelectedRealmId();
  const { data, isPending } = useWhoAmI();

  return [data?.realmAccess?.find((realm) => realm.realmId === realmId), isPending];
}

export function useSelectedRealmBaseUrl(): [string, boolean] {
  const [realm, isLoading] = useSelectedRealm();

  if (import.meta.env.DEV && import.meta.env.VITE_REALM_PROXY_TARGET) {
    return [`${window.location.origin}/apiproxy`, isLoading];
  }

  return [realm?.baseUrl || '', isLoading];
}
