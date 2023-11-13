/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/dead_message.proto */

export interface O5DanteV1DeadMessage {
    infraMessageId?: string;
    messageId?: string;
    queueName?: string;
    grpcName?: string;
    // format: date-time
    rejectedTimestamp?: string;
    // format: date-time
    initialSentTimestamp?: string;
    payload?: O5DanteV1Any;
    // start oneof "problem"
    problem?: {
        invariantViolation?: O5DanteV1InvariantViolation;
        unhandledError?: O5DanteV1UnhandledError;
    }; // end oneof "problem"
}

export enum O5DanteV1Urgency {
    Unspecified = 'URGENCY_UNSPECIFIED',
    Low = 'URGENCY_LOW',
    Medium = 'URGENCY_MEDIUM',
    High = 'URGENCY_HIGH'
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

