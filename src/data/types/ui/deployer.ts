import {
  O5ApplicationV1Demand,
  O5DeployerV1DatabaseMigrationStatus,
  O5DeployerV1DeploymentEvent,
  O5DeployerV1DeploymentStatus,
  O5DeployerV1StackLifecycle,
} from '@/data/types';
import { match, P } from 'ts-pattern';

export const deploymentStatusLabels: Record<O5DeployerV1DeploymentStatus, string> = {
  [O5DeployerV1DeploymentStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1DeploymentStatus.Queued]: 'Queued',
  [O5DeployerV1DeploymentStatus.Triggered]: 'Triggered',
  [O5DeployerV1DeploymentStatus.Waiting]: 'Waiting',
  [O5DeployerV1DeploymentStatus.Available]: 'Available',
  [O5DeployerV1DeploymentStatus.ScalingDown]: 'Scaling Down',
  [O5DeployerV1DeploymentStatus.ScaledDown]: 'Scaled Down',
  [O5DeployerV1DeploymentStatus.InfraMigrate]: 'Infra Migrate',
  [O5DeployerV1DeploymentStatus.InfraMigrated]: 'Infra Migrated',
  [O5DeployerV1DeploymentStatus.DbMigrating]: 'DB Migrating',
  [O5DeployerV1DeploymentStatus.DbMigrated]: 'DB Migrated',
  [O5DeployerV1DeploymentStatus.ScalingUp]: 'Scaling Up',
  [O5DeployerV1DeploymentStatus.ScaledUp]: 'Scaled Up',
  [O5DeployerV1DeploymentStatus.Creating]: 'Creating',
  [O5DeployerV1DeploymentStatus.Upserting]: 'Upserting',
  [O5DeployerV1DeploymentStatus.Upserted]: 'Upserted',
  [O5DeployerV1DeploymentStatus.Done]: 'Done',
  [O5DeployerV1DeploymentStatus.Failed]: 'Failed',
};

export const stackLifecycleLabels: Record<O5DeployerV1StackLifecycle, string> = {
  [O5DeployerV1StackLifecycle.Unspecified]: 'Unspecified',
  [O5DeployerV1StackLifecycle.Progress]: 'Progress',
  [O5DeployerV1StackLifecycle.Complete]: 'Complete',
  [O5DeployerV1StackLifecycle.RollingBack]: 'Rolling Back',
  [O5DeployerV1StackLifecycle.CreateFailed]: 'Create Failed',
  [O5DeployerV1StackLifecycle.Terminal]: 'Terminal',
  [O5DeployerV1StackLifecycle.RolledBack]: 'Rolled Back',
  [O5DeployerV1StackLifecycle.Missing]: 'Missing',
};

export const migrationStatusLabels: Record<O5DeployerV1DatabaseMigrationStatus, string> = {
  [O5DeployerV1DatabaseMigrationStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1DatabaseMigrationStatus.Pending]: 'Pending',
  [O5DeployerV1DatabaseMigrationStatus.Running]: 'Running',
  [O5DeployerV1DatabaseMigrationStatus.Failed]: 'Failed',
  [O5DeployerV1DatabaseMigrationStatus.Cleanup]: 'Cleanup',
  [O5DeployerV1DatabaseMigrationStatus.Completed]: 'Completed',
};

export const applicationDemandLevels: Record<O5ApplicationV1Demand, string> = {
  [O5ApplicationV1Demand.Unspecified]: 'Unspecified',
  [O5ApplicationV1Demand.Light]: 'Light',
  [O5ApplicationV1Demand.Medium]: 'Medium',
  [O5ApplicationV1Demand.Heavy]: 'Heavy',
};

export enum DeploymentEventType {
  Unspecified = 'UNSPECIFIED',
  Created = 'CREATED',
  Triggered = 'TRIGGERED',
  StackCreate = 'STACK_CREATE',
  StackWait = 'STACK_WAIT',
  StackScale = 'STACK_SCALE',
  StackTrigger = 'STACK_TRIGGER',
  StackUpsert = 'STACK_UPSERT',
  StackStatus = 'STACK_STATUS',
  MigrateData = 'MIGRATE_DATA',
  DBMigrateStatus = 'DB_MIGRATE_STATUS',
  DataMigrated = 'DATA_MIGRATED',
  Error = 'ERROR',
  Done = 'DONE',
}

export const deploymentEventTypeLabels: Record<DeploymentEventType, string> = {
  [DeploymentEventType.Unspecified]: 'Unspecified',
  [DeploymentEventType.Created]: 'Created',
  [DeploymentEventType.Triggered]: 'Triggered',
  [DeploymentEventType.StackCreate]: 'Stack Create',
  [DeploymentEventType.StackWait]: 'Stack Wait',
  [DeploymentEventType.StackScale]: 'Stack Scale',
  [DeploymentEventType.StackTrigger]: 'Stack Trigger',
  [DeploymentEventType.StackUpsert]: 'Stack Upsert',
  [DeploymentEventType.StackStatus]: 'Stack Status',
  [DeploymentEventType.MigrateData]: 'Migrate Data',
  [DeploymentEventType.DBMigrateStatus]: 'DB Migrate Status',
  [DeploymentEventType.DataMigrated]: 'Data Migrated',
  [DeploymentEventType.Error]: 'Error',
  [DeploymentEventType.Done]: 'Done',
};

export function getDeploymentEventType(event: O5DeployerV1DeploymentEvent | undefined) {
  return match(event?.event?.type)
    .with({ created: P.not(P.nullish) }, () => DeploymentEventType.Created)
    .with({ triggered: P.not(P.nullish) }, () => DeploymentEventType.Triggered)
    .with({ stackCreate: P.not(P.nullish) }, () => DeploymentEventType.StackCreate)
    .with({ stackWait: P.not(P.nullish) }, () => DeploymentEventType.StackWait)
    .with({ stackScale: P.not(P.nullish) }, () => DeploymentEventType.StackScale)
    .with({ stackTrigger: P.not(P.nullish) }, () => DeploymentEventType.StackTrigger)
    .with({ stackUpsert: P.not(P.nullish) }, () => DeploymentEventType.StackUpsert)
    .with({ stackStatus: P.not(P.nullish) }, () => DeploymentEventType.StackStatus)
    .with({ migrateData: P.not(P.nullish) }, () => DeploymentEventType.MigrateData)
    .with({ dbMigrateStatus: P.not(P.nullish) }, () => DeploymentEventType.DBMigrateStatus)
    .with({ dataMigrated: P.not(P.nullish) }, () => DeploymentEventType.DataMigrated)
    .with({ error: P.not(P.nullish) }, () => DeploymentEventType.Error)
    .with({ done: P.not(P.nullish) }, () => DeploymentEventType.Done)
    .otherwise(() => DeploymentEventType.Unspecified);
}
