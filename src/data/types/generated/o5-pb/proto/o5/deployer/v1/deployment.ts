/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/deployment.proto */

import type { O5DeployerV1KeyValue, O5DeployerV1PostgresDatabase, O5DeployerV1Parameter, O5DeployerV1SnsTopic } from './application';

export interface O5DeployerV1DeploymentState {
    deploymentId?: string;
    status?: O5DeployerV1DeploymentStatus;
    spec?: O5DeployerV1DeploymentSpec;
    stackName?: string;
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
    databases?: O5DeployerV1PostgresDatabase[];
    parameters?: O5DeployerV1Parameter[];
    snsTopics?: O5DeployerV1SnsTopic[];
}

export enum O5DeployerV1DeploymentStatus {
    Unspecified = 'DEPLOYMENT_STATUS_UNSPECIFIED',
    Queued = 'DEPLOYMENT_STATUS_QUEUED',
    Locked = 'DEPLOYMENT_STATUS_LOCKED',
    Waiting = 'DEPLOYMENT_STATUS_WAITING',
    Available = 'DEPLOYMENT_STATUS_AVAILABLE',
    ScalingDown = 'DEPLOYMENT_STATUS_SCALING_DOWN',
    ScaledDown = 'DEPLOYMENT_STATUS_SCALED_DOWN',
    InfraMigrate = 'DEPLOYMENT_STATUS_INFRA_MIGRATE',
    InfraMigrated = 'DEPLOYMENT_STATUS_INFRA_MIGRATED',
    DbMigrating = 'DEPLOYMENT_STATUS_DB_MIGRATING',
    DbMigrated = 'DEPLOYMENT_STATUS_DB_MIGRATED',
    ScalingUp = 'DEPLOYMENT_STATUS_SCALING_UP',
    ScaledUp = 'DEPLOYMENT_STATUS_SCALED_UP',
    Creating = 'DEPLOYMENT_STATUS_CREATING',
    New = 'DEPLOYMENT_STATUS_NEW',
    Done = 'DEPLOYMENT_STATUS_DONE',
    Failed = 'DEPLOYMENT_STATUS_FAILED'
}

export interface O5DeployerV1Actor {
}

export interface O5DeployerV1EventMetadata {
    eventId?: string;
    // format: date-time
    timestamp?: string;
    actor?: O5DeployerV1Actor;
}

export interface O5DeployerV1DeploymentEvent {
    metadata?: O5DeployerV1EventMetadata;
    deploymentId?: string;
    event?: O5DeployerV1DeploymentEventType;
}

export enum O5DeployerV1StackLifecycle {
    Unspecified = 'STACK_LIFECYCLE_UNSPECIFIED',
    Progress = 'STACK_LIFECYCLE_PROGRESS',
    Complete = 'STACK_LIFECYCLE_COMPLETE',
    RollingBack = 'STACK_LIFECYCLE_ROLLING_BACK',
    CreateFailed = 'STACK_LIFECYCLE_CREATE_FAILED',
    Terminal = 'STACK_LIFECYCLE_TERMINAL',
    Missing = 'STACK_LIFECYCLE_MISSING'
}

export interface O5DeployerV1DeploymentEventType {
    // start oneof "type"
    type?: {
        triggered?: {
            spec?: O5DeployerV1DeploymentSpec;
        };
        gotLock?: {};
        stackCreate?: {};
        stackWait?: {};
        stackScale?: {
            desiredCount?: number;
        };
        stackTrigger?: {
            phase?: string;
        };
        stackStatus?: {
            lifecycle?: O5DeployerV1StackLifecycle;
            fullStatus?: string;
            stackOutput?: O5DeployerV1KeyValue[];
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
    Unspecified = 'DATABASE_MIGRATION_STATUS_UNSPECIFIED',
    Pending = 'DATABASE_MIGRATION_STATUS_PENDING',
    Running = 'DATABASE_MIGRATION_STATUS_RUNNING',
    Cleanup = 'DATABASE_MIGRATION_STATUS_CLEANUP',
    Completed = 'DATABASE_MIGRATION_STATUS_COMPLETED',
    Failed = 'DATABASE_MIGRATION_STATUS_FAILED'
}

