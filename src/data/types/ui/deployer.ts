import {
  O5DeployerV1DeploymentEvent,
  O5DeployerV1DeploymentStatus,
  O5DeployerV1KeyValue,
  O5DeployerV1StepOutputType,
  O5DeployerV1StepRequestType,
  O5DeployerV1StepStatus,
} from '@/data/types';
import { match, P } from 'ts-pattern';

export const deploymentStatusLabels: Record<O5DeployerV1DeploymentStatus, string> = {
  [O5DeployerV1DeploymentStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1DeploymentStatus.Queued]: 'Queued',
  [O5DeployerV1DeploymentStatus.Triggered]: 'Triggered',
  [O5DeployerV1DeploymentStatus.Waiting]: 'Waiting',
  [O5DeployerV1DeploymentStatus.Available]: 'Available',
  [O5DeployerV1DeploymentStatus.Running]: 'Running',
  [O5DeployerV1DeploymentStatus.Done]: 'Done',
  [O5DeployerV1DeploymentStatus.Failed]: 'Failed',
  [O5DeployerV1DeploymentStatus.Terminated]: 'Terminated',
};

export enum DeploymentEventType {
  Unspecified = 'UNSPECIFIED',
  Created = 'CREATED',
  Done = 'DONE',
  Error = 'ERROR',
  RunSteps = 'RUN_STEPS',
  StackAvailable = 'STACK_AVAILABLE',
  StackWait = 'STACK_WAIT',
  StackWaitFailure = 'STACK_WAIT_FAILURE',
  StepResult = 'STEP_RESULT',
  Terminated = 'TERMINATED',
  Triggered = 'TRIGGERED',
}

export const deploymentEventTypeLabels: Record<DeploymentEventType, string> = {
  [DeploymentEventType.Unspecified]: 'Unspecified',
  [DeploymentEventType.Created]: 'Created',
  [DeploymentEventType.Error]: 'Error',
  [DeploymentEventType.Done]: 'Done',
  [DeploymentEventType.RunSteps]: 'Run Steps',
  [DeploymentEventType.StackAvailable]: 'Stack Available',
  [DeploymentEventType.StackWaitFailure]: 'Stack Wait Failure',
  [DeploymentEventType.StepResult]: 'Step Result',
  [DeploymentEventType.StackWait]: 'Stack Wait',
  [DeploymentEventType.Terminated]: 'Terminated',
  [DeploymentEventType.Triggered]: 'Triggered',
};

export function getDeploymentEventType(event: O5DeployerV1DeploymentEvent | undefined) {
  return match(event?.event?.type)
    .with({ created: P.not(P.nullish) }, () => DeploymentEventType.Created)
    .with({ done: P.not(P.nullish) }, () => DeploymentEventType.Done)
    .with({ error: P.not(P.nullish) }, () => DeploymentEventType.Error)
    .with({ runSteps: P.not(P.nullish) }, () => DeploymentEventType.RunSteps)
    .with({ stackAvailable: P.not(P.nullish) }, () => DeploymentEventType.StackAvailable)
    .with({ stackWait: P.not(P.nullish) }, () => DeploymentEventType.StackWait)
    .with({ stackWaitFailure: P.not(P.nullish) }, () => DeploymentEventType.StackWaitFailure)
    .with({ stepResult: P.not(P.nullish) }, () => DeploymentEventType.StepResult)
    .with({ terminated: P.not(P.nullish) }, () => DeploymentEventType.Terminated)
    .with({ triggered: P.not(P.nullish) }, () => DeploymentEventType.Triggered)
    .otherwise(() => DeploymentEventType.Unspecified);
}

export const deploymentStepStatusLabels: Record<O5DeployerV1StepStatus, string> = {
  [O5DeployerV1StepStatus.Unspecified]: 'Unspecified',
  [O5DeployerV1StepStatus.Blocked]: 'Blocked',
  [O5DeployerV1StepStatus.Active]: 'Active',
  [O5DeployerV1StepStatus.Done]: 'Done',
  [O5DeployerV1StepStatus.Failed]: 'Failed',
};

export enum DeploymentStepRequestType {
  Unspecified = 'UNSPECIFIED',
  CFCreate = 'CF_CREATE',
  CFPlan = 'CF_PLAN',
  CFScale = 'CF_SCALE',
  CFUpdate = 'CF_UPDATE',
  EvalJoin = 'EVAL_JOIN',
  PGCleanUp = 'PG_CLEAN_UP',
  PGEvaluate = 'PG_EVALUATE',
  PGMigrate = 'PG_MIGRATE',
  PGUpsert = 'PG_UPSERT',
}

export function getDeploymentStepRequestType(request: O5DeployerV1StepRequestType | undefined) {
  return match(request?.type)
    .with({ cfCreate: P.not(P.nullish) }, () => DeploymentStepRequestType.CFCreate)
    .with({ cfPlan: P.not(P.nullish) }, () => DeploymentStepRequestType.CFPlan)
    .with({ cfScale: P.not(P.nullish) }, () => DeploymentStepRequestType.CFScale)
    .with({ cfUpdate: P.not(P.nullish) }, () => DeploymentStepRequestType.CFUpdate)
    .with({ evalJoin: P.not(P.nullish) }, () => DeploymentStepRequestType.EvalJoin)
    .with({ pgCleanup: P.not(P.nullish) }, () => DeploymentStepRequestType.PGCleanUp)
    .with({ pgEvaluate: P.not(P.nullish) }, () => DeploymentStepRequestType.PGEvaluate)
    .with({ pgMigrate: P.not(P.nullish) }, () => DeploymentStepRequestType.PGMigrate)
    .with({ pgUpsert: P.not(P.nullish) }, () => DeploymentStepRequestType.PGUpsert)
    .otherwise(() => DeploymentStepRequestType.Unspecified);
}

export const deploymentStepRequestTypeLabels: Record<DeploymentStepRequestType, string> = {
  [DeploymentStepRequestType.Unspecified]: 'Unspecified',
  [DeploymentStepRequestType.CFCreate]: 'CF Create',
  [DeploymentStepRequestType.CFPlan]: 'CF Plan',
  [DeploymentStepRequestType.CFScale]: 'CF Scale',
  [DeploymentStepRequestType.CFUpdate]: 'CF Update',
  [DeploymentStepRequestType.EvalJoin]: 'Eval Join',
  [DeploymentStepRequestType.PGCleanUp]: 'PG Clean Up',
  [DeploymentStepRequestType.PGEvaluate]: 'PG Evaluate',
  [DeploymentStepRequestType.PGMigrate]: 'PG Migrate',
  [DeploymentStepRequestType.PGUpsert]: 'PG Upsert',
};

export enum DeploymentStepOutputType {
  Unspecified = 'UNSPECIFIED',
  CFStatus = 'CF_STATUS',
}

export function getDeploymentStepOutputType(output: O5DeployerV1StepOutputType | undefined) {
  return match(output?.type)
    .with({ cfStatus: P.not(P.nullish) }, () => DeploymentStepOutputType.CFStatus)
    .otherwise(() => DeploymentStepOutputType.Unspecified);
}

export const deploymentStepOutputTypeLabels: Record<DeploymentStepOutputType, string> = {
  [DeploymentStepOutputType.Unspecified]: 'Unspecified',
  [DeploymentStepOutputType.CFStatus]: 'CF Status',
};

export function deployerKeyValuePairsToJSON(pairs: O5DeployerV1KeyValue[] | undefined) {
  const obj = pairs?.reduce(
    (acc, pair) => {
      return {
        ...acc,
        [pair.name || '']: pair.value || '',
      };
    },
    {} as Record<string, string>,
  );

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '{}';
  }
}
