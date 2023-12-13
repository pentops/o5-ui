/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: listify-pb/proto/listify/query/v1/page.proto */

export interface ListifyQueryV1PageRequest {
    token?: string;
    // format: int64
    limit?: string;
}

export interface ListifyQueryV1PageResponse {
    nextToken?: string;
    finalPage?: boolean;
    // format: int64
    totalPageRecords?: string;
    // format: int64
    totalRecords?: string;
}

