import { create } from 'zustand';
import { useWhoAmI } from '@/data/api';
import { O5AuthV1ServiceRealmAccess } from '@/data/types';

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

export function useSelectedRealm(): [O5AuthV1ServiceRealmAccess | undefined, boolean] {
  const realmId = useSelectedRealmId();
  const { data, isLoading } = useWhoAmI();

  return [data?.realmAccess?.find((realm) => realm.realmId === realmId), isLoading];
}

export function useSelectedRealmBaseUrl(): [string, boolean] {
  const [realm, isLoading] = useSelectedRealm();
  return [realm?.baseUrl || '', isLoading];
}
