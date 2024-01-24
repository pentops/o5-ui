/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/proto/psm/list/v1/annotations.proto */

export interface PsmListV1MessageConstraint {
}

export interface PsmListV1ListRequestMessage {
    defaultSort?: string[];
    sortTiebreaker?: string[];
}

export interface PsmListV1OneofConstraint {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1FieldConstraint {
    // start oneof "type"
    type?: {
        double?: PsmListV1NumericRules;
        fixed32?: PsmListV1NumericRules;
        fixed64?: PsmListV1NumericRules;
        float?: PsmListV1NumericRules;
        int32?: PsmListV1NumericRules;
        int64?: PsmListV1NumericRules;
        sfixed32?: PsmListV1NumericRules;
        sfixed64?: PsmListV1NumericRules;
        sint32?: PsmListV1NumericRules;
        sint64?: PsmListV1NumericRules;
        uint32?: PsmListV1NumericRules;
        uint64?: PsmListV1NumericRules;
        bool?: PsmListV1BoolRules;
        string?: PsmListV1StringRules;
        enum?: PsmListV1EnumRules;
        timestamp?: PsmListV1TimestampRules;
    }; // end oneof "type"
}

export interface PsmListV1FilteringConstraint {
    filterable?: boolean;
    defaultFilters?: string[];
}

export interface PsmListV1SortingConstraint {
    sortable?: boolean;
    defaultSort?: boolean;
}

export interface PsmListV1SearchingConstraint {
    searchable?: boolean;
}

export interface PsmListV1NumericRules {
    filtering?: PsmListV1FilteringConstraint;
    sorting?: PsmListV1SortingConstraint;
}

export interface PsmListV1BoolRules {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1StringRules {
    // start oneof "wellKnown"
    wellKnown?: {
        openText?: PsmListV1OpenTextRules;
        date?: PsmListV1DateRules;
        foreignKey?: PsmListV1ForeignKeyRules;
    }; // end oneof "wellKnown"
}

export interface PsmListV1OpenTextRules {
    searching?: PsmListV1SearchingConstraint;
}

export interface PsmListV1DateRules {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1ForeignKeyRules {
    // start oneof "type"
    type?: {
        uniqueString?: PsmListV1UniqueStringRules;
        uuid?: PsmListV1UuidRules;
    }; // end oneof "type"
}

export interface PsmListV1UniqueStringRules {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1UuidRules {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1EnumRules {
    filtering?: PsmListV1FilteringConstraint;
}

export interface PsmListV1TimestampRules {
    filtering?: PsmListV1FilteringConstraint;
    sorting?: PsmListV1SortingConstraint;
}

