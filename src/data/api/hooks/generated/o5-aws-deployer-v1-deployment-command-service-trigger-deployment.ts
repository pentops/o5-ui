/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import {
  O5AwsDeployerV1DeploymentCommandServiceTriggerDeploymentResponse,
  O5AwsDeployerV1DeploymentCommandServiceTriggerDeploymentRequest,
} from '../../../types/generated';
import { o5AwsDeployerV1DeploymentCommandServiceTriggerDeployment } from '../../generated';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

/**
 * @generated by NormalizedQueryPlugin (post /deployer/v1/c/deployments/:deploymentId) */
export function useO5AwsDeployerV1DeploymentCommandServiceTriggerDeployment(
  options?: Partial<
    UseMutationOptions<
      O5AwsDeployerV1DeploymentCommandServiceTriggerDeploymentResponse | undefined,
      Error,
      O5AwsDeployerV1DeploymentCommandServiceTriggerDeploymentRequest,
      unknown
    >
  >,
) {
  return useMutation({
    mutationKey: ['o5AwsDeployerV1DeploymentCommandServiceTriggerDeployment'],
    mutationFn: async (request: O5AwsDeployerV1DeploymentCommandServiceTriggerDeploymentRequest) =>
      o5AwsDeployerV1DeploymentCommandServiceTriggerDeployment('', request),
    ...options,
  });
}