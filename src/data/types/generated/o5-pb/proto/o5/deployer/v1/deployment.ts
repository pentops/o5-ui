/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/deployment.proto */

import type { O5DeployerV1EventMetadata } from './event';
import type { O5DeployerV1KeyValue, O5DeployerV1PostgresDatabase, O5DeployerV1CloudFormationStackParameter, O5DeployerV1SnsTopic } from './application';

export interface O5DeployerV1DeploymentState {
    deploymentId?: string;
    status?: O5DeployerV1DeploymentStatus;
    spec?: O5DeployerV1DeploymentSpec;
    stackName?: string;
    stackId?: string;
    waitingOnRemotePhase?: string;
    lastStackLifecycle?: O5DeployerV1StackLifecycle;
    stackOutput?: O5DeployerV1KeyValue[];
    dataMigrations?: O5DeployerV1DatabaseMigrationState[];
}

export interface O5DeployerV1DeploymentSpec {
    appName?: string;
    version?: string;
    environmentName?: string;
    templateUrl?: string;
    cancelUpdates?: boolean;
    rotateCredentials?: boolean;
    ecsCluster?: string;
    quickMode?: boolean;
    databases?: O5DeployerV1PostgresDatabase[];
    parameters?: O5DeployerV1CloudFormationStackParameter[];
    snsTopics?: O5DeployerV1SnsTopic[];
}

export enum O5DeployerV1DeploymentStatus {
    Unspecified = 'UNSPECIFIED',
    Queued = 'QUEUED',
    Triggered = 'TRIGGERED',
    Waiting = 'WAITING',
    Available = 'AVAILABLE',
    ScalingDown = 'SCALING_DOWN',
    ScaledDown = 'SCALED_DOWN',
    InfraMigrate = 'INFRA_MIGRATE',
    InfraMigrated = 'INFRA_MIGRATED',
    DbMigrating = 'DB_MIGRATING',
    DbMigrated = 'DB_MIGRATED',
    ScalingUp = 'SCALING_UP',
    ScaledUp = 'SCALED_UP',
    Creating = 'CREATING',
    Upserting = 'UPSERTING',
    Upserted = 'UPSERTED',
    Done = 'DONE',
    Failed = 'FAILED'
}

export interface O5DeployerV1DeploymentEvent {
    metadata?: O5DeployerV1EventMetadata;
    deploymentId?: string;
    event?: O5DeployerV1DeploymentEventType;
}

export enum O5DeployerV1StackLifecycle {
    Unspecified = 'UNSPECIFIED',
    Progress = 'PROGRESS',
    Complete = 'COMPLETE',
    RollingBack = 'ROLLING_BACK',
    CreateFailed = 'CREATE_FAILED',
    Terminal = 'TERMINAL',
    RolledBack = 'ROLLED_BACK',
    Missing = 'MISSING'
}

export interface O5DeployerV1DeploymentEventType {
    // start oneof "type"
    type?: {
        created?: {
            spec?: O5DeployerV1DeploymentSpec;
        };
        triggered?: {};
        stackCreate?: {};
        stackWait?: {};
        stackScale?: {
            desiredCount?: number;
        };
        stackTrigger?: {
            phase?: string;
        };
        stackUpsert?: {};
        stackStatus?: {
            lifecycle?: O5DeployerV1StackLifecycle;
            fullStatus?: string;
            stackOutput?: O5DeployerV1KeyValue[];
            deploymentPhase?: string;
        };
        migrateData?: {
            databases?: O5DeployerV1DatabaseMigration[];
        };
        dbMigrateStatus?: {
            dbName?: string;
            migrationId?: string;
            status?: O5DeployerV1DatabaseMigrationStatus;
            error?: string;
        };
        dataMigrated?: {};
        error?: {
            error?: string;
        };
        done?: {};
    }; // end oneof "type"
}

export interface O5DeployerV1DatabaseMigration {
    migrationId?: string;
    dbName?: string;
}

export interface O5DeployerV1DatabaseMigrationState {
    migrationId?: string;
    dbName?: string;
    rotateCredentials?: boolean;
    status?: O5DeployerV1DatabaseMigrationStatus;
}

export enum O5DeployerV1DatabaseMigrationStatus {
    Unspecified = 'UNSPECIFIED',
    Pending = 'PENDING',
    Running = 'RUNNING',
    Cleanup = 'CLEANUP',
    Completed = 'COMPLETED',
    Failed = 'FAILED'
}

