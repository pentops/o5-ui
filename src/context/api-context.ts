import { create } from 'zustand';
import { useWhoAmI } from '@/data/api';

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

export function useSelectedRealm() {
  const realmId = useSelectedRealmId();
  const { data } = useWhoAmI();

  return data?.realmAccess?.find((realm) => realm.realmId === realmId);
}

export function useSelectedRealmBaseUrl() {
  const realm = useSelectedRealm();
  return realm?.baseUrl || '';
}
