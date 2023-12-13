/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/topic/aws.proto */

import type { O5DeployerV1CloudFormationStackParameter, O5DeployerV1PostgresDatabase } from '../application';

export interface O5DeployerV1TopicStackId {
    deploymentId?: string;
    deploymentPhase?: string;
    stackName?: string;
}

export interface O5DeployerV1TopicStabalizeStackMessage {
    stackId?: O5DeployerV1TopicStackId;
    cancelUpdate?: boolean;
}

export interface O5DeployerV1TopicCreateNewStackMessage {
    stackId?: O5DeployerV1TopicStackId;
    templateUrl?: string;
    parameters?: O5DeployerV1CloudFormationStackParameter[];
    desiredCount?: number;
    extraResources?: O5DeployerV1TopicExtraResources;
}

export interface O5DeployerV1TopicUpdateStackMessage {
    stackId?: O5DeployerV1TopicStackId;
    templateUrl?: string;
    parameters?: O5DeployerV1CloudFormationStackParameter[];
    desiredCount?: number;
    extraResources?: O5DeployerV1TopicExtraResources;
}

export interface O5DeployerV1TopicExtraResources {
    snsTopics?: string[];
}

export interface O5DeployerV1TopicDeleteStackMessage {
    stackId?: O5DeployerV1TopicStackId;
}

export interface O5DeployerV1TopicScaleStackMessage {
    stackId?: O5DeployerV1TopicStackId;
    desiredCount?: number;
}

export interface O5DeployerV1TopicCancelStackUpdateMessage {
    stackId?: O5DeployerV1TopicStackId;
}

export interface O5DeployerV1TopicRunDatabaseMigrationMessage {
    migrationId?: string;
    deploymentId?: string;
    database?: O5DeployerV1PostgresDatabase;
    rotateCredentials?: boolean;
    migrationTaskArn?: string;
    secretArn?: string;
    rootSecretName?: string;
    ecsClusterName?: string;
}

