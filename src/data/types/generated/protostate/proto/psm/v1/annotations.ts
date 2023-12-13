/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/proto/psm/v1/annotations.proto */

export interface PsmV1StateObjectOptions {
    name?: string;
}

export interface PsmV1EventObjectOptions {
    name?: string;
}

export interface PsmV1EventTypeObjectOptions {
}

export interface PsmV1EventField {
    eventType?: boolean;
    metadata?: boolean;
    stateKey?: boolean;
}

export interface PsmV1EventTypeField {
    subKey?: boolean;
}

export interface PsmV1StateQueryServiceOptions {
    name?: string;
}

export interface PsmV1StateQueryMethodOptions {
    get?: boolean;
    list?: boolean;
    listEvents?: boolean;
    name?: string;
}

