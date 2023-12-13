/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: listify-pb/proto/listify/annotations/v1/annotations.proto */

export interface ListifyAnnotationsV1MethodOptions {
    enable?: boolean;
    rankField?: string;
}

export interface ListifyAnnotationsV1OneofRulesOptions {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1FieldRulesOptions {
    // start oneof "type"
    type?: {
        double?: ListifyAnnotationsV1NumericRules;
        fixed32?: ListifyAnnotationsV1NumericRules;
        fixed64?: ListifyAnnotationsV1NumericRules;
        float?: ListifyAnnotationsV1NumericRules;
        int32?: ListifyAnnotationsV1NumericRules;
        int64?: ListifyAnnotationsV1NumericRules;
        sfixed32?: ListifyAnnotationsV1NumericRules;
        sfixed64?: ListifyAnnotationsV1NumericRules;
        sint32?: ListifyAnnotationsV1NumericRules;
        sint64?: ListifyAnnotationsV1NumericRules;
        uint32?: ListifyAnnotationsV1NumericRules;
        uint64?: ListifyAnnotationsV1NumericRules;
        bool?: ListifyAnnotationsV1BoolRules;
        string?: ListifyAnnotationsV1StringRules;
        enum?: ListifyAnnotationsV1EnumRules;
        timestamp?: ListifyAnnotationsV1TimestampRules;
    }; // end oneof "type"
}

export interface ListifyAnnotationsV1FilteringOptions {
    filterable?: boolean;
    exclude?: boolean;
}

export interface ListifyAnnotationsV1SortingOptions {
    sortable?: boolean;
    defaultSort?: boolean;
}

export interface ListifyAnnotationsV1SearchingOptions {
    searchable?: boolean;
}

export interface ListifyAnnotationsV1NumericRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
    sorting?: ListifyAnnotationsV1SortingOptions;
}

export interface ListifyAnnotationsV1BoolRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1StringRules {
    // start oneof "wellKnown"
    wellKnown?: {
        openText?: ListifyAnnotationsV1OpenTextRules;
        date?: ListifyAnnotationsV1DateRules;
        foreignKey?: ListifyAnnotationsV1ForeignKeyRules;
    }; // end oneof "wellKnown"
}

export interface ListifyAnnotationsV1OpenTextRules {
    fieldOverride?: string;
    searching?: ListifyAnnotationsV1SearchingOptions;
}

export interface ListifyAnnotationsV1DateRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1ForeignKeyRules {
    // start oneof "type"
    type?: {
        uniqueString?: ListifyAnnotationsV1UniqueStringRules;
        uuid?: ListifyAnnotationsV1UuidRules;
    }; // end oneof "type"
}

export interface ListifyAnnotationsV1UniqueStringRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1UuidRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1EnumRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
}

export interface ListifyAnnotationsV1TimestampRules {
    fieldOverride?: string;
    filtering?: ListifyAnnotationsV1FilteringOptions;
    sorting?: ListifyAnnotationsV1SortingOptions;
}

