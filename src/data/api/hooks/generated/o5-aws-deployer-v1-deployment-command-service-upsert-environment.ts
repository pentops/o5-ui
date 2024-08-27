/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import {
  O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentResponse,
  O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentRequest,
} from '../../../types/generated';
import { o5AwsDeployerV1DeploymentCommandServiceUpsertEnvironment } from '../../generated';
import { schema } from 'normalizr';
import { o5AwsDeployerV1EnvironmentStateEntity } from '../../../entities/generated/o5-aws-deployer-v1-environment-state';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

export const o5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentResponseEntity =
  new schema.Object<O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentResponse>({
    state: o5AwsDeployerV1EnvironmentStateEntity,
  });
/**
 * @generated by NormalizedQueryPlugin (post /deployer/v1/c/environments/:environmentId/config) */
export function useO5AwsDeployerV1DeploymentCommandServiceUpsertEnvironment(
  options?: Partial<
    UseMutationOptions<
      O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentResponse | undefined,
      Error,
      O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentRequest,
      unknown
    >
  >,
) {
  return useMutation({
    mutationKey: ['o5AwsDeployerV1DeploymentCommandServiceUpsertEnvironment'],
    mutationFn: async (request: O5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentRequest) =>
      o5AwsDeployerV1DeploymentCommandServiceUpsertEnvironment('', request),
    meta: { normalizationSchema: o5AwsDeployerV1DeploymentCommandServiceUpsertEnvironmentResponseEntity },
    ...options,
  });
}