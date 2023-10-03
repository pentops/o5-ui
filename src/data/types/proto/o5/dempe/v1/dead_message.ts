/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: proto/o5/dempe/v1/dead_message.proto at 2023-10-03T17:32:35.931Z */

export interface O5DempeV1DeadMessage {
    infraMessageId?: string;
    messageId?: string;
    queueName?: string;
    grpcName?: string;
    // format: date-time
    rejectedTimestamp?: string;
    // format: date-time
    initialSentTimestamp?: string;
    payload?: O5DempeV1Any;
    // start oneof "problem"
    invariantViolation?: O5DempeV1InvariantViolation;
    unhandledError?: O5DempeV1UnhandledError; // end oneof "problem"
}

export enum O5DempeV1Urgency {
    Unspecified = 'URGENCY_UNSPECIFIED',
    Low = 'URGENCY_LOW',
    Medium = 'URGENCY_MEDIUM',
    High = 'URGENCY_HIGH'
}

export interface O5DempeV1InvariantViolation {
    description?: string;
    error?: O5DempeV1Any;
    urgency?: O5DempeV1Urgency;
}

export interface O5DempeV1UnhandledError {
    error?: string;
}

export interface O5DempeV1Any {
    proto?: { '@type': string, value: any };
    json?: string;
}

