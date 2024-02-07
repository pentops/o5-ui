/**
 * DO NOT EDIT! Client generated from jdef.json */

import { buildMergedRequestInit, makeRequest } from '@pentops/jsonapi-request';
import type {
  O5AuthV1WhoamiResponse,
  O5DanteV1GetDeadMessageResponse,
  O5DanteV1GetDeadMessageRequest,
  O5DanteV1ListDeadMessagesResponse,
  O5DanteV1ListDeadMessageEventsResponse,
  O5DanteV1ListDeadMessageEventsRequest,
  O5DanteV1UpdateDeadMessageResponse,
  O5DanteV1UpdateDeadMessageRequest,
  O5DanteV1ReplayDeadMessageResponse,
  O5DanteV1ReplayDeadMessageRequest,
  O5DanteV1RejectDeadMessageResponse,
  O5DanteV1RejectDeadMessageRequest,
  O5DeployerV1GetDeploymentResponse,
  O5DeployerV1GetDeploymentRequest,
  O5DeployerV1ListDeploymentEventsResponse,
  O5DeployerV1ListDeploymentEventsRequest,
  O5DeployerV1ListDeploymentsResponse,
  O5DeployerV1ListDeploymentsRequest,
  O5DeployerV1GetStackResponse,
  O5DeployerV1GetStackRequest,
  O5DeployerV1ListStacksResponse,
  O5DeployerV1ListStacksRequest,
  O5DeployerV1ListStackEventsResponse,
  O5DeployerV1ListStackEventsRequest,
  O5DeployerV1TriggerDeploymentResponse,
  O5DeployerV1TriggerDeploymentRequest,
} from '../../types/generated';

export async function o5AuthV1AuthServiceWhoami(baseUrl: string | undefined, requestInit?: RequestInit): Promise<O5AuthV1WhoamiResponse | undefined> {
  return makeRequest<O5AuthV1WhoamiResponse>(...buildMergedRequestInit('GET', baseUrl || '', '/o5-auth/v1/whoami', undefined, requestInit));
}

export async function o5DanteV1DeadMessageQueryServiceGetDeadMessage(
  baseUrl: string | undefined,
  request?: O5DanteV1GetDeadMessageRequest,
  requestInit?: RequestInit,
): Promise<O5DanteV1GetDeadMessageResponse | undefined> {
  return makeRequest<O5DanteV1GetDeadMessageResponse, O5DanteV1GetDeadMessageRequest>(
    ...buildMergedRequestInit('GET', baseUrl || '', '/dante/v1/q/message/:messageId', request, requestInit),
  );
}

export async function o5DanteV1DeadMessageQueryServiceListDeadMessages(
  baseUrl: string | undefined,
  requestInit?: RequestInit,
): Promise<O5DanteV1ListDeadMessagesResponse | undefined> {
  return makeRequest<O5DanteV1ListDeadMessagesResponse>(
    ...buildMergedRequestInit('GET', baseUrl || '', '/dante/v1/q/messages', undefined, requestInit),
  );
}

export async function o5DanteV1DeadMessageQueryServiceListDeadMessageEvents(
  baseUrl: string | undefined,
  request?: O5DanteV1ListDeadMessageEventsRequest,
  requestInit?: RequestInit,
): Promise<O5DanteV1ListDeadMessageEventsResponse | undefined> {
  return makeRequest<O5DanteV1ListDeadMessageEventsResponse, O5DanteV1ListDeadMessageEventsRequest>(
    ...buildMergedRequestInit('GET', baseUrl || '', '/dante/v1/q/message/:messageId/events', request, requestInit),
  );
}

export async function o5DanteV1DeadMessageCommandServiceUpdateDeadMessage(
  baseUrl: string | undefined,
  request?: O5DanteV1UpdateDeadMessageRequest,
  requestInit?: RequestInit,
): Promise<O5DanteV1UpdateDeadMessageResponse | undefined> {
  return makeRequest<O5DanteV1UpdateDeadMessageResponse, O5DanteV1UpdateDeadMessageRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/dante/v1/c/messages/:messageId/update', request, requestInit),
  );
}

export async function o5DanteV1DeadMessageCommandServiceReplayDeadMessage(
  baseUrl: string | undefined,
  request?: O5DanteV1ReplayDeadMessageRequest,
  requestInit?: RequestInit,
): Promise<O5DanteV1ReplayDeadMessageResponse | undefined> {
  return makeRequest<O5DanteV1ReplayDeadMessageResponse, O5DanteV1ReplayDeadMessageRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/dante/v1/c/messages/:messageId/replay', request, requestInit),
  );
}

export async function o5DanteV1DeadMessageCommandServiceRejectDeadMessage(
  baseUrl: string | undefined,
  request?: O5DanteV1RejectDeadMessageRequest,
  requestInit?: RequestInit,
): Promise<O5DanteV1RejectDeadMessageResponse | undefined> {
  return makeRequest<O5DanteV1RejectDeadMessageResponse, O5DanteV1RejectDeadMessageRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/dante/v1/c/messages/:messageId/shelve', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceGetDeployment(
  baseUrl: string | undefined,
  request?: O5DeployerV1GetDeploymentRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1GetDeploymentResponse | undefined> {
  return makeRequest<O5DeployerV1GetDeploymentResponse, O5DeployerV1GetDeploymentRequest>(
    ...buildMergedRequestInit('GET', baseUrl || '', '/deployer/v1/q/deployment/:deploymentId', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceListDeploymentEvents(
  baseUrl: string | undefined,
  request?: O5DeployerV1ListDeploymentEventsRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1ListDeploymentEventsResponse | undefined> {
  return makeRequest<O5DeployerV1ListDeploymentEventsResponse, O5DeployerV1ListDeploymentEventsRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/deployer/v1/q/deployment/:deploymentId/events', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceListDeployments(
  baseUrl: string | undefined,
  request?: O5DeployerV1ListDeploymentsRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1ListDeploymentsResponse | undefined> {
  return makeRequest<O5DeployerV1ListDeploymentsResponse, O5DeployerV1ListDeploymentsRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/deployer/v1/q/deployments', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceGetStack(
  baseUrl: string | undefined,
  request?: O5DeployerV1GetStackRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1GetStackResponse | undefined> {
  return makeRequest<O5DeployerV1GetStackResponse, O5DeployerV1GetStackRequest>(
    ...buildMergedRequestInit('GET', baseUrl || '', '/deployer/v1/q/stack/:stackId', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceListStacks(
  baseUrl: string | undefined,
  request?: O5DeployerV1ListStacksRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1ListStacksResponse | undefined> {
  return makeRequest<O5DeployerV1ListStacksResponse, O5DeployerV1ListStacksRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/deployer/v1/q/stacks', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentQueryServiceListStackEvents(
  baseUrl: string | undefined,
  request?: O5DeployerV1ListStackEventsRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1ListStackEventsResponse | undefined> {
  return makeRequest<O5DeployerV1ListStackEventsResponse, O5DeployerV1ListStackEventsRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/deployer/v1/q/stack/:stackId/events', request, requestInit),
  );
}

export async function o5DeployerV1DeploymentCommandServiceTriggerDeployment(
  baseUrl: string | undefined,
  request?: O5DeployerV1TriggerDeploymentRequest,
  requestInit?: RequestInit,
): Promise<O5DeployerV1TriggerDeploymentResponse | undefined> {
  return makeRequest<O5DeployerV1TriggerDeploymentResponse, O5DeployerV1TriggerDeploymentRequest>(
    ...buildMergedRequestInit('POST', baseUrl || '', '/deployer/v1/c/deployments/:deploymentId', request, requestInit),
  );
}
