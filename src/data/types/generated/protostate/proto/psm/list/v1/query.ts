/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/proto/psm/list/v1/query.proto */

export interface PsmListV1QueryRequest {
    search?: PsmListV1Search[];
    sort?: PsmListV1Sort[];
    filters?: PsmListV1Filter[];
}

export interface PsmListV1Search {
    field?: string;
    value?: string;
}

export interface PsmListV1Sort {
    field?: string;
    descending?: boolean;
}

export interface PsmListV1Filter {
    field?: string;
    // start oneof "filterValue"
    filterValue?: {
        value?: string;
        range?: PsmListV1Range;
    }; // end oneof "filterValue"
}

export interface PsmListV1Range {
    min?: string;
    max?: string;
}

