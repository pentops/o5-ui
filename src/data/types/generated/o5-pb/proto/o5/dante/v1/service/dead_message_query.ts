/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/service/dead_message_query.proto */

import type { O5DanteV1DeadMessageState, O5DanteV1DeadMessageEvent } from '../dead_message';

export interface O5DanteV1ServiceGetDeadMessageRequest {
    messageId?: string;
}

export interface O5DanteV1ServiceGetDeadMessageResponse {
    message?: O5DanteV1DeadMessageState;
    events?: O5DanteV1DeadMessageEvent[];
}

export interface O5DanteV1ServiceListDeadMessagesRequest {
}

export interface O5DanteV1ServiceListDeadMessagesResponse {
    messages?: O5DanteV1DeadMessageState[];
}

export interface O5DanteV1ServiceListDeadMessageEventsRequest {
    messageId?: string;
}

export interface O5DanteV1ServiceListDeadMessageEventsResponse {
    events?: O5DanteV1DeadMessageEvent[];
}

