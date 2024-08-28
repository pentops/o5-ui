/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import { useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData, type QueryKey } from '@tanstack/react-query';
import { schema } from 'normalizr';
import { o5AwsDeployerV1DeploymentStateEntity } from '../../../entities/generated/o5-aws-deployer-v1-deployment-state';
import {
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponse,
  O5AwsDeployerV1DeploymentQueryServiceListDeploymentsRequest,
} from '../../../types/generated';
import { o5AwsDeployerV1DeploymentQueryServiceListDeployments } from '../../generated';

export const o5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponseEntity =
  new schema.Object<O5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponse>({
    deployments: [o5AwsDeployerV1DeploymentStateEntity],
  });
/**
 * @generated by NormalizedQueryPlugin (post /deployer/v1/q/deployments) */
export function useO5AwsDeployerV1DeploymentQueryServiceListDeployments(
  request?: O5AwsDeployerV1DeploymentQueryServiceListDeploymentsRequest | undefined,
  options?: Partial<
    UseInfiniteQueryOptions<
      O5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponse | undefined,
      Error,
      InfiniteData<O5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponse | undefined>,
      O5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponse | undefined,
      QueryKey,
      string | undefined
    >
  >,
) {
  return useInfiniteQuery({
    queryKey: [o5AwsDeployerV1DeploymentStateEntity.key, request],
    queryFn: async ({ pageParam }) =>
      o5AwsDeployerV1DeploymentQueryServiceListDeployments(
        '',
        request ? { ...request, page: pageParam ? { token: pageParam } : undefined } : undefined,
      ),
    enabled: true,
    meta: { normalizationSchema: o5AwsDeployerV1DeploymentQueryServiceListDeploymentsResponseEntity },
    getNextPageParam: (response) => response?.page?.nextToken,
    initialPageParam: undefined,
    ...options,
  });
}
