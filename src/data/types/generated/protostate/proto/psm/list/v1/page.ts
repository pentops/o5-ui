/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/proto/psm/list/v1/page.proto */

export interface PsmListV1PageRequest {
    token?: string;
    // format: int64
    limit?: string;
}

export interface PsmListV1PageResponse {
    nextToken?: string;
}

