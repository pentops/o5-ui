import { match, P } from 'ts-pattern';
import { O5DeployerV1StackEvent, O5DeployerV1StackStatus } from '@/data/types';

export enum StackEventType {
  Unspecified = 'Unspecified',
  Triggered = 'Triggered',
  DeploymentCompleted = 'DeploymentCompleted',
  DeploymentFailed = 'DeploymentFailed',
  Available = 'Available',
}

export const stackEventTypeLabels: Record<StackEventType, string> = {
  [StackEventType.Unspecified]: 'Unspecified',
  [StackEventType.Triggered]: 'Triggered',
  [StackEventType.DeploymentCompleted]: 'Deployment Completed',
  [StackEventType.DeploymentFailed]: 'Deployment Failed',
  [StackEventType.Available]: 'Available',
};

export const stackStatusLabels: Record<O5DeployerV1StackStatus, string> = {
  [O5DeployerV1StackStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1StackStatus.Creating]: 'Creating',
  [O5DeployerV1StackStatus.Stable]: 'Stable',
  [O5DeployerV1StackStatus.Available]: 'Available',
  [O5DeployerV1StackStatus.Migrating]: 'Migrating',
  [O5DeployerV1StackStatus.Broken]: 'Broken',
};

export function getStackEventType(event: O5DeployerV1StackEvent | undefined) {
  return match(event?.event?.type)
    .with({ triggered: P.not(P.nullish) }, () => StackEventType.Triggered)
    .with({ deploymentCompleted: P.not(P.nullish) }, () => StackEventType.DeploymentCompleted)
    .with({ deploymentFailed: P.not(P.nullish) }, () => StackEventType.DeploymentFailed)
    .with({ available: P.not(P.nullish) }, () => StackEventType.Available)
    .otherwise(() => StackEventType.Unspecified);
}
