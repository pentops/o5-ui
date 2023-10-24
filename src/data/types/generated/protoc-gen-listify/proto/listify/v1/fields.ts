/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protoc-gen-listify/proto/listify/v1/fields.proto at 2023-10-24T23:07:49.767Z */

export interface ListifyV1PageRequest {
    offset?: string;
    // format: int64
    limit?: string;
}

export interface ListifyV1PageResponse {
    nextOffset?: string;
    finalPage?: boolean;
    // format: int64
    totalPageRecords?: string;
    // format: int64
    totalRecords?: string;
}

export interface ListifyV1Search {
    query?: string;
}

export interface ListifyV1Sort {
    field?: string;
    descending?: boolean;
}

export interface ListifyV1Filter {
    field?: string;
    // start oneof "filterValue"
    value?: string;
    range?: ListifyV1Range; // end oneof "filterValue"
}

export interface ListifyV1FilterClauses {
    clauses?: ListifyV1FilterClause[];
}

export interface ListifyV1FilterClause {
    predicate?: string;
    arguments?: ListifyV1FilterArgument[];
}

export interface ListifyV1FilterArgument {
    // start oneof "kind"
    double?: number;
    fixed32?: number;
    // format: fixed64
    fixed64?: string;
    float?: number;
    int32?: number;
    // format: int64
    int64?: string;
    sfixed32?: number;
    // format: sfixed64
    sfixed64?: string;
    sint32?: number;
    // format: sint64
    sint64?: string;
    uint32?: number;
    // format: uint64
    uint64?: string;
    string?: string; // end oneof "kind"
}

export interface ListifyV1Range {
    // start oneof "type"
    double?: ListifyV1DoubleRange;
    fixed32?: ListifyV1Fixed32Range;
    fixed64?: ListifyV1Fixed64Range;
    float?: ListifyV1FloatRange;
    int32?: ListifyV1Int32Range;
    int64?: ListifyV1Int64Range;
    sfixed32?: ListifyV1SFixed32Range;
    sfixed64?: ListifyV1SFixed64Range;
    sint32?: ListifyV1SInt32Range;
    sint64?: ListifyV1SInt64Range;
    uint32?: ListifyV1UInt32Range;
    uint64?: ListifyV1UInt64Range;
    timestamp?: ListifyV1TimestampRange;
    date?: ListifyV1DateRange; // end oneof "type"
}

export interface ListifyV1DoubleRange {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1Fixed32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1Fixed64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyV1FloatRange {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1Int32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1Int64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyV1SFixed32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1SFixed64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyV1SInt32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1SInt64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyV1UInt32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyV1UInt64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyV1TimestampRange {
    // format: date-time
    min?: string;
    // format: date-time
    max?: string;
}

export interface ListifyV1DateRange {
    min?: string | null;
    max?: string | null;
}

