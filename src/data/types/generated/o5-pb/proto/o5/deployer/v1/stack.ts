/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/stack.proto */

import type { O5DeployerV1EventMetadata } from './event';

export interface O5DeployerV1StackState {
    stackId?: string;
    status?: O5DeployerV1StackStatus;
    currentDeployment?: O5DeployerV1StackDeployment;
    applicationName?: string;
    environmentName?: string;
    queuedDeployments?: O5DeployerV1StackDeployment[];
}

export enum O5DeployerV1StackStatus {
    Unspecified = 'UNSPECIFIED',
    Creating = 'CREATING',
    Stable = 'STABLE',
    Available = 'AVAILABLE',
    Migrating = 'MIGRATING',
    Broken = 'BROKEN'
}

export interface O5DeployerV1StackDeployment {
    deploymentId?: string;
    version?: string;
}

export interface O5DeployerV1StackEvent {
    metadata?: O5DeployerV1EventMetadata;
    stackId?: string;
    event?: O5DeployerV1StackEventType;
}

export interface O5DeployerV1StackEventType {
    // start oneof "type"
    triggered?: {
        deployment?: O5DeployerV1StackDeployment;
        applicationName?: string;
        environmentName?: string;
    };
    deploymentCompleted?: {
        deployment?: O5DeployerV1StackDeployment;
    };
    deploymentFailed?: {
        deployment?: O5DeployerV1StackDeployment;
        error?: string;
    };
    available?: {}; // end oneof "type"
}

