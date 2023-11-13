/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/service.proto */

import type { O5AuthV1Actor } from '../../auth/v1/actor';
import type { O5DanteV1DeadMessage } from './dead_message';

export interface O5DanteV1ListMessagesRequest {
}

export interface O5DanteV1ListMessagesResponse {
    messages?: O5DanteV1CapturedMessage[];
}

export interface O5DanteV1GetMessageRequest {
    messageId?: string | null;
}

export interface O5DanteV1CapturedMessage {
    cause?: O5DanteV1DeadMessage;
}

export interface O5DanteV1GetMessageResponse {
    message?: O5DanteV1CapturedMessage;
    actions?: {
        action?: O5DanteV1MessageAction;
        actor?: O5AuthV1Actor;
        timestamp?: string;
    }[];
}

export interface O5DanteV1MessageAction {
    id?: string;
    note?: string;
    // start oneof "action"
    action?: {
        delete?: O5DanteV1ActionDelete;
        requeue?: O5DanteV1ActionRequeue;
        edit?: O5DanteV1ActionEdit;
    }; // end oneof "action"
}

export interface O5DanteV1MessagesActionRequest {
    messageIds?: string[];
    action?: O5DanteV1MessageAction;
}

export interface O5DanteV1ActionDelete {
}

export interface O5DanteV1ActionRequeue {
}

export interface O5DanteV1ActionEdit {
    // format: bytes
    newMessageJson?: string;
}

export interface O5DanteV1MessagesActionResponse {
}

