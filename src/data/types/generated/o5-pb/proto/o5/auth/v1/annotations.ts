/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/auth/v1/annotations.proto at 2023-11-01T17:25:13.638Z */

export interface O5AuthV1AuthMethodOptions {
    // start oneof "authMethod"
    jwtBearer?: O5AuthV1AuthMethodJwtBearer;
    none?: O5AuthV1AuthMethodNone; // end oneof "authMethod"
}

export interface O5AuthV1AuthMethodNone {
    passThroughHeaders?: string[];
}

export interface O5AuthV1AuthMethodJwtBearer {
    requiredScopes?: string[];
}

