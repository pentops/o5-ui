/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/dante/v1/topic/dead_message_topic.proto */

import type { O5DanteV1Any, O5DanteV1Problem } from '../dead_message';

export interface O5DanteV1TopicDeadMessage {
    messageId?: string;
    infraMessageId?: string;
    queueName?: string;
    grpcName?: string;
    // format: date-time
    timestamp?: string;
    payload?: O5DanteV1Any;
    problem?: O5DanteV1Problem;
}

