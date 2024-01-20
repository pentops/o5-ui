/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/proto/psm/state/v1/annotations.proto */

export interface PsmStateV1StateObjectOptions {
    name?: string;
}

export interface PsmStateV1EventObjectOptions {
    name?: string;
}

export interface PsmStateV1EventTypeObjectOptions {
}

export interface PsmStateV1StateField {
    primaryKey?: boolean;
}

export interface PsmStateV1EventField {
    eventType?: boolean;
    metadata?: boolean;
    stateKey?: boolean;
    stateField?: boolean;
}

export interface PsmStateV1EventTypeField {
    subKey?: boolean;
}

export interface PsmStateV1StateQueryServiceOptions {
    name?: string;
}

export interface PsmStateV1StateQueryMethodOptions {
    get?: boolean;
    list?: boolean;
    listEvents?: boolean;
    name?: string;
}

