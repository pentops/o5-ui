/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/service/query.proto */

import type { O5DeployerV1StackState, O5DeployerV1StackEvent } from '../stack';
import type { PsmListV1QueryRequest } from '../../../../../../protostate/proto/psm/list/v1/query';
import type { PsmListV1PageRequest, PsmListV1PageResponse } from '../../../../../../protostate/proto/psm/list/v1/page';
import type { O5DeployerV1DeploymentState, O5DeployerV1DeploymentEvent } from '../deployment';

export interface O5DeployerV1ServiceGetDeploymentRequest {
    deploymentId?: string;
}

export interface O5DeployerV1ServiceGetDeploymentResponse {
    state?: O5DeployerV1DeploymentState;
    events?: O5DeployerV1DeploymentEvent[];
}

export interface O5DeployerV1ServiceListDeploymentEventsRequest {
    deploymentId?: string;
    page?: PsmListV1PageRequest;
    query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1ServiceListDeploymentEventsResponse {
    events?: O5DeployerV1DeploymentEvent[];
    page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ServiceListDeploymentsRequest {
    page?: PsmListV1PageRequest;
    query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1ServiceListDeploymentsResponse {
    deployments?: O5DeployerV1DeploymentState[];
    page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ServiceGetStackRequest {
    stackId?: string;
}

export interface O5DeployerV1ServiceGetStackResponse {
    state?: O5DeployerV1StackState;
    events?: O5DeployerV1StackEvent[];
}

export interface O5DeployerV1ServiceListStacksRequest {
    page?: PsmListV1PageRequest;
    query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1ServiceListStacksResponse {
    stacks?: O5DeployerV1StackState[];
    page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ServiceListStackEventsRequest {
    stackId?: string;
    page?: PsmListV1PageRequest;
    query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1ServiceListStackEventsResponse {
    events?: O5DeployerV1StackEvent[];
    page?: PsmListV1PageResponse;
}

