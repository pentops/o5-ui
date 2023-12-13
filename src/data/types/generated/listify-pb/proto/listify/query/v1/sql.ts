/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: listify-pb/proto/listify/query/v1/sql.proto */

export interface ListifyQueryV1SqlClauses {
    clauses?: ListifyQueryV1SqlClause[];
}

export interface ListifyQueryV1SqlClause {
    predicate?: string;
    arguments?: ListifyQueryV1SqlArgument[];
}

export interface ListifyQueryV1SqlArgument {
    // start oneof "kind"
    kind?: {
        double?: number;
        fixed32?: number;
        fixed64?: string;
        float?: number;
        int32?: number;
        int64?: string;
        sfixed32?: number;
        sfixed64?: string;
        sint32?: number;
        sint64?: string;
        uint32?: number;
        uint64?: string;
        string?: string;
    }; // end oneof "kind"
}

