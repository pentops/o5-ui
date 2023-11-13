/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/topic/aws.proto */

import type { O5DeployerV1KeyValue, O5DeployerV1PostgresDatabase } from '../application';

export interface O5DeployerV1TopicStabalizeStackMessage {
    stackName?: string;
    cancelUpdate?: boolean;
}

export interface O5DeployerV1TopicCreateNewStackMessage {
    stackName?: string;
    templateUrl?: string;
    parameters?: O5DeployerV1KeyValue[];
}

export interface O5DeployerV1TopicUpdateStackMessage {
    stackName?: string;
    templateUrl?: string;
    parameters?: O5DeployerV1KeyValue[];
}

export interface O5DeployerV1TopicDeleteStackMessage {
    stackName?: string;
}

export interface O5DeployerV1TopicScaleStackMessage {
    stackName?: string;
    desiredCount?: number;
}

export interface O5DeployerV1TopicCancelStackUpdateMessage {
    stackName?: string;
}

export interface O5DeployerV1TopicUpsertSnsTopicsMessage {
    environmentName?: string;
    topicNames?: string[];
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

