/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/testproto/test/v1/bar.proto */

import type { ListifyQueryV1PageRequest, ListifyQueryV1PageResponse } from '../../../../listify-pb/proto/listify/query/v1/page';

export interface TestV1GetBarRequest {
    barId?: string;
}

export interface TestV1GetBarResponse {
    state?: TestV1BarState;
    events?: TestV1BarEvent[];
}

export interface TestV1BarState {
    barId?: string;
    tenantId?: string;
    name?: string;
    field?: string;
    status?: TestV1BarStatus;
}

export enum TestV1BarStatus {
    Unspecified = 'UNSPECIFIED',
    Active = 'ACTIVE',
    Deleted = 'DELETED'
}

export interface TestV1BarEvent {
    metadata?: TestV1StrangeMetadata;
    barId?: string;
    event?: TestV1BarEventType;
}

export interface TestV1StrangeMetadata {
    eventId?: string;
    // format: date-time
    timestamp?: string;
}

export interface TestV1BarEventType {
    // start oneof "type"
    type?: {
        created?: {
            name?: string;
            field?: string;
        };
        updated?: {
            name?: string;
            field?: string;
        };
        deleted?: {};
    }; // end oneof "type"
}

export interface TestV1ListBarsRequest {
    tenantId?: string;
    page?: ListifyQueryV1PageRequest;
}

export interface TestV1ListBarsResponse {
    bars?: TestV1BarState[];
    page?: ListifyQueryV1PageResponse;
}

export interface TestV1ListBarEventsRequest {
    barId?: string;
    page?: ListifyQueryV1PageRequest;
}

export interface TestV1ListBarEventsResponse {
    events?: TestV1BarEvent[];
    page?: ListifyQueryV1PageResponse;
}

