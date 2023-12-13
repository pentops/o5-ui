/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: listify-pb/proto/listify/query/v1/query.proto */

export interface ListifyQueryV1Search {
    query?: string;
}

export interface ListifyQueryV1Sort {
    field?: string;
    descending?: boolean;
}

export interface ListifyQueryV1Filter {
    field?: string;
    // start oneof "filterValue"
    filterValue?: {
        value?: string;
        range?: ListifyQueryV1Range;
    }; // end oneof "filterValue"
}

export interface ListifyQueryV1Range {
    // start oneof "type"
    type?: {
        double?: ListifyQueryV1DoubleRange;
        fixed32?: ListifyQueryV1Fixed32Range;
        fixed64?: ListifyQueryV1Fixed64Range;
        float?: ListifyQueryV1FloatRange;
        int32?: ListifyQueryV1Int32Range;
        int64?: ListifyQueryV1Int64Range;
        sfixed32?: ListifyQueryV1SFixed32Range;
        sfixed64?: ListifyQueryV1SFixed64Range;
        sint32?: ListifyQueryV1SInt32Range;
        sint64?: ListifyQueryV1SInt64Range;
        uint32?: ListifyQueryV1UInt32Range;
        uint64?: ListifyQueryV1UInt64Range;
        timestamp?: ListifyQueryV1TimestampRange;
        date?: ListifyQueryV1DateRange;
    }; // end oneof "type"
}

export interface ListifyQueryV1DoubleRange {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1Fixed32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1Fixed64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyQueryV1FloatRange {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1Int32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1Int64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyQueryV1SFixed32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1SFixed64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyQueryV1SInt32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1SInt64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyQueryV1UInt32Range {
    min?: number | null;
    max?: number | null;
}

export interface ListifyQueryV1UInt64Range {
    min?: string | null;
    max?: string | null;
}

export interface ListifyQueryV1TimestampRange {
    // format: date-time
    min?: string;
    // format: date-time
    max?: string;
}

export interface ListifyQueryV1DateRange {
    min?: string | null;
    max?: string | null;
}

