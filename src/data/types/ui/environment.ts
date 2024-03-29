import { O5DeployerV1EnvironmentEventType, O5DeployerV1EnvironmentStatus } from '@/data/types';
import { match, P } from 'ts-pattern';

export const environmentStatusLabels: Record<O5DeployerV1EnvironmentStatus, string> = {
  [O5DeployerV1EnvironmentStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1EnvironmentStatus.Active]: 'Active',
};

export enum EnvironmentEventType {
  Unspecified = 'unspecified',
  Configured = 'configured',
}

export function getEnvironmentEventType(event: O5DeployerV1EnvironmentEventType | undefined): EnvironmentEventType {
  return match(event?.type)
    .with({ configured: P.not(P.nullish) }, () => EnvironmentEventType.Configured)
    .otherwise(() => EnvironmentEventType.Unspecified);
}

export const environmentEventTypeLabels: Record<EnvironmentEventType, string> = {
  [EnvironmentEventType.Unspecified]: 'Unspecified',
  [EnvironmentEventType.Configured]: 'Configured',
};
