/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protoc-gen-listify/proto/listify/v1/annotations.proto */

export interface ListifyV1MethodOptions {
    enable?: boolean;
}

export interface ListifyV1OneofRulesOptions {
    filterable?: boolean;
}

export interface ListifyV1FieldRulesOptions {
    // start oneof "type"
    type?: {
        double?: ListifyV1NumericRules;
        fixed32?: ListifyV1NumericRules;
        fixed64?: ListifyV1NumericRules;
        float?: ListifyV1NumericRules;
        int32?: ListifyV1NumericRules;
        int64?: ListifyV1NumericRules;
        sfixed32?: ListifyV1NumericRules;
        sfixed64?: ListifyV1NumericRules;
        sint32?: ListifyV1NumericRules;
        sint64?: ListifyV1NumericRules;
        uint32?: ListifyV1NumericRules;
        uint64?: ListifyV1NumericRules;
        bool?: ListifyV1BoolRules;
        string?: ListifyV1StringRules;
        enum?: ListifyV1EnumRules;
        timestamp?: ListifyV1TimestampRules;
    }; // end oneof "type"
}

export interface ListifyV1NumericRules {
    filterable?: boolean;
    sortable?: boolean;
}

export interface ListifyV1BoolRules {
    filterable?: boolean;
}

export interface ListifyV1StringRules {
    // start oneof "wellKnown"
    wellKnown?: {
        openText?: ListifyV1OpenTextRules;
        date?: ListifyV1DateRules;
        foreignKey?: ListifyV1ForeignKeyRules;
    }; // end oneof "wellKnown"
}

export interface ListifyV1OpenTextRules {
    searchable?: boolean;
}

export interface ListifyV1DateRules {
    filterable?: boolean;
}

export interface ListifyV1ForeignKeyRules {
    // start oneof "type"
    type?: {
        uniqueString?: ListifyV1UniqueStringRules;
        uuid?: ListifyV1UuidRules;
    }; // end oneof "type"
}

export interface ListifyV1UniqueStringRules {
    filterable?: boolean;
}

export interface ListifyV1UuidRules {
    filterable?: boolean;
}

export interface ListifyV1EnumRules {
    filterable?: boolean;
}

export interface ListifyV1TimestampRules {
    filterable?: boolean;
    sortable?: boolean;
}

