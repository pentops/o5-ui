/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/topic/deployer.proto */

import type { O5DeployerV1KeyValue } from '../application';
import type { O5DeployerV1TopicStackId } from './aws';
import type { O5DeployerV1DeploymentSpec, O5DeployerV1StackLifecycle, O5DeployerV1DatabaseMigrationStatus } from '../deployment';

export interface O5DeployerV1TopicRequestDeploymentMessage {
    deploymentId?: string;
    spec?: O5DeployerV1DeploymentSpec;
}

export interface O5DeployerV1TopicDeploymentCompleteMessage {
    deploymentId?: string;
    stackId?: string;
    version?: string;
    environmentName?: string;
    applicationName?: string;
}

export interface O5DeployerV1TopicDeploymentFailedMessage {
    deploymentId?: string;
    stackId?: string;
    version?: string;
    environmentName?: string;
    applicationName?: string;
    error?: string;
}

export interface O5DeployerV1TopicTriggerDeploymentMessage {
    deploymentId?: string;
    stackId?: string;
    version?: string;
    environmentName?: string;
    applicationName?: string;
}

export interface O5DeployerV1TopicStackStatusChangedMessage {
    stackId?: O5DeployerV1TopicStackId;
    status?: string;
    outputs?: O5DeployerV1KeyValue[];
    lifecycle?: O5DeployerV1StackLifecycle;
}

export interface O5DeployerV1TopicMigrationStatusChangedMessage {
    migrationId?: string;
    deploymentId?: string;
    status?: O5DeployerV1DatabaseMigrationStatus;
    error?: string;
}

