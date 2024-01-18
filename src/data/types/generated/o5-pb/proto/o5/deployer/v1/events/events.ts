/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/events/events.proto */

import type { O5DeployerV1StackEventType, O5DeployerV1StackState } from '../stack';
import type { O5DeployerV1DeploymentEventType, O5DeployerV1DeploymentState } from '../deployment';
import type { O5DeployerV1EventMetadata } from '../event';

export interface O5DeployerV1EventsDeploymentEventMessage {
    metadata?: O5DeployerV1EventMetadata;
    event?: O5DeployerV1DeploymentEventType;
    state?: O5DeployerV1DeploymentState;
}

export interface O5DeployerV1EventsStackEventMessage {
    metadata?: O5DeployerV1EventMetadata;
    event?: O5DeployerV1StackEventType;
    state?: O5DeployerV1StackState;
}

