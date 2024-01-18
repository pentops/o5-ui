/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/dead_message.proto */

import type { O5AuthV1Actor } from '../../auth/v1/actor';

export interface O5DanteV1DeadMessageState {
    messageId?: string;
    status?: O5DanteV1MessageStatus;
    currentSpec?: O5DanteV1DeadMessageSpec;
}

export interface O5DanteV1DeadMessageSpec {
    versionId?: string;
    infraMessageId?: string;
    queueName?: string;
    grpcName?: string;
    // format: date-time
    createdAt?: string;
    payload?: O5DanteV1Any;
    problem?: O5DanteV1Problem;
}

export interface O5DanteV1Problem {
    // start oneof "type"
    invariantViolation?: O5DanteV1InvariantViolation;
    unhandledError?: O5DanteV1UnhandledError; // end oneof "type"
}

export enum O5DanteV1MessageStatus {
    Unspecified = 'UNSPECIFIED',
    Created = 'CREATED',
    Updated = 'UPDATED',
    Replayed = 'REPLAYED',
    Rejected = 'REJECTED'
}

export enum O5DanteV1Urgency {
    Unspecified = 'UNSPECIFIED',
    Low = 'LOW',
    Medium = 'MEDIUM',
    High = 'HIGH'
}

export interface O5DanteV1InvariantViolation {
    description?: string;
    error?: O5DanteV1Any;
    urgency?: O5DanteV1Urgency;
}

export interface O5DanteV1UnhandledError {
    error?: string;
}

export interface O5DanteV1Any {
    proto?: { '@type': string, value: any };
    json?: string;
}

export interface O5DanteV1DeadMessageEvent {
    metadata?: O5DanteV1Metadata;
    messageId?: string;
    event?: O5DanteV1DeadMessageEventType;
}

export interface O5DanteV1DeadMessageEventType {
    // start oneof "type"
    created?: {
        spec?: O5DanteV1DeadMessageSpec;
    };
    updated?: {
        spec?: O5DanteV1DeadMessageSpec;
    };
    replayed?: {};
    rejected?: {
        reason?: string;
    }; // end oneof "type"
}

export interface O5DanteV1Metadata {
    eventId?: string;
    // format: date-time
    timestamp?: string;
    actor?: O5AuthV1Actor;
}

