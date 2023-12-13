/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: protostate/testproto/test/v1/foo.proto */

import type { ListifyQueryV1PageRequest, ListifyQueryV1PageResponse } from '../../../../listify-pb/proto/listify/query/v1/page';

export interface TestV1GetFooRequest {
    fooId?: string;
}

export interface TestV1GetFooResponse {
    state?: TestV1FooState;
    events?: TestV1FooEvent[];
}

export interface TestV1FooState {
    fooId?: string;
    tenantId?: string;
    name?: string;
    field?: string;
    lastEventId?: string;
    status?: TestV1FooStatus;
}

export enum TestV1FooStatus {
    Unspecified = 'UNSPECIFIED',
    Active = 'ACTIVE',
    Deleted = 'DELETED'
}

export interface TestV1FooEvent {
    metadata?: TestV1Metadata;
    fooId?: string;
    event?: TestV1FooEventType;
}

export interface TestV1Metadata {
    eventId?: string;
    // format: date-time
    timestamp?: string;
    actor?: TestV1Actor;
}

export interface TestV1Actor {
    actorId?: string;
}

export interface TestV1FooEventType {
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

export interface TestV1ListFoosRequest {
    tenantId?: string;
    page?: ListifyQueryV1PageRequest;
}

export interface TestV1ListFoosResponse {
    foos?: TestV1FooState[];
    page?: ListifyQueryV1PageResponse;
}

export interface TestV1ListFooEventsRequest {
    fooId?: string;
    page?: ListifyQueryV1PageRequest;
}

export interface TestV1ListFooEventsResponse {
    events?: TestV1FooEvent[];
    page?: ListifyQueryV1PageResponse;
}

