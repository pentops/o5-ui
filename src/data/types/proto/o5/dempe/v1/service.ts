/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: proto/o5/dempe/v1/service.proto at 2023-09-12T20:14:34.109Z */

import type { O5AuthV1Actor } from '../../auth/v1/actor';
import type { O5DempeV1DeadMessage } from './dead_message';

export interface O5DempeV1ListMessagesRequest {
}

export interface O5DempeV1ListMessagesResponse {
    messages?: O5DempeV1CapturedMessage[];
}

export interface O5DempeV1GetMessageRequest {
    messageId?: string | null;
}

export interface O5DempeV1CapturedMessage {
    cause?: O5DempeV1DeadMessage;
}

export interface O5DempeV1GetMessageResponse {
    message?: O5DempeV1CapturedMessage;
    actions?: O5DempeV1MessageAction[];
}

export interface O5DempeV1MessageAction {
    note?: string;
    actor?: O5AuthV1Actor;
    // format: date-time
    timestamp?: string;
    // start oneof "action"
    delete?: O5DempeV1ActionDelete;
    requeue?: O5DempeV1ActionRequeue;
    edit?: O5DempeV1ActionEdit; // end oneof "action"
}

export interface O5DempeV1MessageActionRequest {
    messageId?: string;
    action?: O5DempeV1MessageAction;
}

export interface O5DempeV1ActionDelete {
}

export interface O5DempeV1ActionRequeue {
}

export interface O5DempeV1ActionEdit {
    // format: bytes
    newMessageJson?: string;
}

export interface O5DempeV1MessageActionResponse {
}

