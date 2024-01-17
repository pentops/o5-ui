/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/service/dead_message_command.proto */

import type { O5DanteV1DeadMessageSpec, O5DanteV1DeadMessageState } from '../dead_message';

export interface O5DanteV1ServiceUpdateDeadMessageRequest {
    messageId?: string;
    replacesVersionId?: string;
    versionId?: string;
    message?: O5DanteV1DeadMessageSpec;
}

export interface O5DanteV1ServiceUpdateDeadMessageResponse {
    message?: O5DanteV1DeadMessageState;
}

export interface O5DanteV1ServiceReplayDeadMessageRequest {
    messageId?: string;
}

export interface O5DanteV1ServiceReplayDeadMessageResponse {
    message?: O5DanteV1DeadMessageState;
}

export interface O5DanteV1ServiceRejectDeadMessageRequest {
    messageId?: string;
    reason?: string;
}

export interface O5DanteV1ServiceRejectDeadMessageResponse {
    message?: O5DanteV1DeadMessageState;
}

