/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/service/service.proto */

import type { O5DeployerV1StackState, O5DeployerV1StackEvent } from '../stack';
import type { ListifyQueryV1Search, ListifyQueryV1Sort, ListifyQueryV1Filter } from '../../../../../../listify-pb/proto/listify/query/v1/query';
import type { ListifyQueryV1PageRequest, ListifyQueryV1PageResponse } from '../../../../../../listify-pb/proto/listify/query/v1/page';
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
    page?: ListifyQueryV1PageRequest;
    search?: ListifyQueryV1Search;
    sorts?: ListifyQueryV1Sort[];
    filters?: ListifyQueryV1Filter[];
}

export interface O5DeployerV1ServiceListDeploymentEventsResponse {
    events?: O5DeployerV1DeploymentEvent[];
    page?: ListifyQueryV1PageResponse;
}

export interface O5DeployerV1ServiceListDeploymentsRequest {
    page?: ListifyQueryV1PageRequest;
    search?: ListifyQueryV1Search;
    sorts?: ListifyQueryV1Sort[];
    filters?: ListifyQueryV1Filter[];
}

export interface O5DeployerV1ServiceListDeploymentsResponse {
    deployments?: O5DeployerV1DeploymentState[];
    page?: ListifyQueryV1PageResponse;
}

export interface O5DeployerV1ServiceGetStackRequest {
    stackId?: string;
}

export interface O5DeployerV1ServiceGetStackResponse {
    state?: O5DeployerV1StackState;
    events?: O5DeployerV1StackEvent[];
}

export interface O5DeployerV1ServiceListStacksRequest {
    page?: ListifyQueryV1PageRequest;
    search?: ListifyQueryV1Search;
    sorts?: ListifyQueryV1Sort[];
    filters?: ListifyQueryV1Filter[];
}

export interface O5DeployerV1ServiceListStacksResponse {
    stacks?: O5DeployerV1StackState[];
    page?: ListifyQueryV1PageResponse;
}

export interface O5DeployerV1ServiceListStackEventsRequest {
    stackId?: string;
    page?: ListifyQueryV1PageRequest;
    search?: ListifyQueryV1Search;
    sorts?: ListifyQueryV1Sort[];
    filters?: ListifyQueryV1Filter[];
}

export interface O5DeployerV1ServiceListStackEventsResponse {
    events?: O5DeployerV1StackEvent[];
    page?: ListifyQueryV1PageResponse;
}

