/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/messaging/v1/topic/bridge.proto */

export interface O5MessagingV1TopicSendMessage {
    id?: string;
    // format: bytes
    payload?: string;
    destination?: string;
    messageType?: string;
    headers?: O5MessagingV1TopicMessageHeader[];
}

export interface O5MessagingV1TopicMessageHeader {
    key?: string;
    value?: string;
}

