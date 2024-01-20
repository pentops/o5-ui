/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/auth/v1/service/auth_service.proto */

export interface O5AuthV1ServiceWhoamiRequest {
}

export interface O5AuthV1ServiceWhoamiResponse {
    realmAccess?: O5AuthV1ServiceRealmAccess[];
}

export interface O5AuthV1ServiceRealmAccess {
    realmId?: string;
    realmName?: string;
    baseUrl?: string;
    multiTenant?: boolean;
    tenantId?: string;
    metadata?: Record<string, string>;
}

