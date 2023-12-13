/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/service/service.proto */

import type { O5AuthV1Actor } from '../../../auth/v1/actor';
import type { O5DanteV1DeadMessage } from '../dead_message';

export interface O5DanteV1ServiceListMessagesRequest {
}

export interface O5DanteV1ServiceListMessagesResponse {
    messages?: O5DanteV1ServiceCapturedMessage[];
}

export interface O5DanteV1ServiceGetMessageRequest {
    messageId?: string | null;
}

export interface O5DanteV1ServiceCapturedMessage {
    cause?: O5DanteV1DeadMessage;
}

export interface O5DanteV1ServiceGetMessageResponse {
    message?: O5DanteV1ServiceCapturedMessage;
    actions?: {
        action?: O5DanteV1ServiceMessageAction;
        actor?: O5AuthV1Actor;
        timestamp?: string;
    }[];
}

export interface O5DanteV1ServiceMessageAction {
    id?: string;
    note?: string;
    // start oneof "action"
    action?: {
        delete?: O5DanteV1ServiceActionDelete;
        requeue?: O5DanteV1ServiceActionRequeue;
        edit?: O5DanteV1ServiceActionEdit;
    }; // end oneof "action"
}

export interface O5DanteV1ServiceMessagesActionRequest {
    messageIds?: string[];
    action?: O5DanteV1ServiceMessageAction;
}

export interface O5DanteV1ServiceActionDelete {
}

export interface O5DanteV1ServiceActionRequeue {
}

export interface O5DanteV1ServiceActionEdit {
    // format: bytes
    newMessageJson?: string;
}

export interface O5DanteV1ServiceMessagesActionResponse {
}

