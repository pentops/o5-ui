/**
 * @generated by @pentops/jsonapi-jdef-ts-generator (Plugin: NormalizedQueryPlugin) - do not edit */

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { J5RegistryGithubV1RepoCommandServiceTriggerResponse, J5RegistryGithubV1RepoCommandServiceTriggerRequest } from '../../../types/generated';
import { j5RegistryGithubV1RepoCommandServiceTrigger } from '../../generated';

/**
 * @generated by NormalizedQueryPlugin (post /registry/github/v1/c/repo/:owner/:repo/trigger) */

export function buildJ5RegistryGithubV1RepoCommandServiceTriggerKey() {
  return ['/j5.registry.github.v1.RepoCommandService/Trigger'] as const;
}

export function useJ5RegistryGithubV1RepoCommandServiceTrigger(
  options?: Partial<
    UseMutationOptions<
      J5RegistryGithubV1RepoCommandServiceTriggerResponse | undefined,
      Error,
      J5RegistryGithubV1RepoCommandServiceTriggerRequest,
      unknown
    >
  >,
) {
  return useMutation({
    mutationKey: buildJ5RegistryGithubV1RepoCommandServiceTriggerKey(),
    mutationFn: async (request: J5RegistryGithubV1RepoCommandServiceTriggerRequest) => j5RegistryGithubV1RepoCommandServiceTrigger('', request),
    ...options,
  });
}
