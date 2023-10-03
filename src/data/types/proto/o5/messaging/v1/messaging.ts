/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: proto/o5/messaging/v1/messaging.proto at 2023-10-03T17:32:35.931Z */

export interface O5MessagingV1Config {
    // start oneof "type"
    broadcast?: O5MessagingV1BroadcastConfig;
    unicast?: O5MessagingV1UnicastConfig;
    reply?: O5MessagingV1ReplyConfig; // end oneof "type"
}

export interface O5MessagingV1BroadcastConfig {
    name?: string;
}

export interface O5MessagingV1UnicastConfig {
    name?: string;
}

export interface O5MessagingV1ReplyConfig {
    name?: string;
}

