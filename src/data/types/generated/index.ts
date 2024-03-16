/**
 * DO NOT EDIT! Types generated from jdef.json */

export enum O5ApplicationV1RouteGroup {
  Unspecified = 'UNSPECIFIED',
  First = 'FIRST',
  Normal = 'NORMAL',
  Fallback = 'FALLBACK',
}

export interface O5AuthV1Actor {}

export interface O5AuthV1RealmAccess {
  baseUrl?: string;
  metadata?: Record<string, string>;
  multiTenant: boolean;
  // format: uuid
  realmId?: string;
  realmName?: string;
  // format: uuid
  tenantId?: string;
}

export interface O5DanteV1Any {
  json?: string;
  proto?: {};
}

export interface O5DanteV1DeadMessageEvent {
  event?: O5DanteV1DeadMessageEventType;
  // format: uuid
  messageId?: string;
  metadata: O5DanteV1Metadata;
}

export interface O5DanteV1DeadMessageEventType {
  type?: {
    // start oneOf
    created?: O5DanteV1DeadMessageEventTypeCreated;
    rejected?: O5DanteV1DeadMessageEventTypeRejected;
    replayed?: O5DanteV1DeadMessageEventTypeReplayed;
    updated?: O5DanteV1DeadMessageEventTypeUpdated;
    // end oneOf
  };
}

export interface O5DanteV1DeadMessageEventTypeCreated {
  spec?: O5DanteV1DeadMessageSpec;
}

export interface O5DanteV1DeadMessageEventTypeRejected {
  reason?: string;
}

export interface O5DanteV1DeadMessageEventTypeReplayed {}

export interface O5DanteV1DeadMessageEventTypeUpdated {
  spec?: O5DanteV1DeadMessageSpec;
}

export interface O5DanteV1DeadMessageSpec {
  // format: date-time
  createdAt: string;
  grpcName?: string;
  infraMessageId?: string;
  payload?: O5DanteV1Any;
  problem?: O5DanteV1Problem;
  queueName?: string;
  // format: uuid
  versionId?: string;
}

export interface O5DanteV1DeadMessageState {
  currentSpec?: O5DanteV1DeadMessageSpec;
  // format: uuid
  messageId?: string;
  status?: O5DanteV1MessageStatus;
}

export interface O5DanteV1InvariantViolation {
  description?: string;
  error?: O5DanteV1Any;
  urgency?: O5DanteV1Urgency;
}

export enum O5DanteV1MessageStatus {
  Unspecified = 'UNSPECIFIED',
  Created = 'CREATED',
  Updated = 'UPDATED',
  Replayed = 'REPLAYED',
  Rejected = 'REJECTED',
}

export interface O5DanteV1Metadata {
  actor?: O5AuthV1Actor;
  // format: uuid
  eventId?: string;
  // format: date-time
  timestamp: string;
}

export interface O5DanteV1Problem {
  type?: {
    // start oneOf
    invariantViolation?: O5DanteV1InvariantViolation;
    unhandledError?: O5DanteV1UnhandledError;
    // end oneOf
  };
}

export interface O5DanteV1UnhandledError {
  error?: string;
}

export enum O5DanteV1Urgency {
  Unspecified = 'UNSPECIFIED',
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export interface O5DeployerV1Actor {}

export enum O5DeployerV1CFLifecycle {
  Unspecified = 'UNSPECIFIED',
  Progress = 'PROGRESS',
  Complete = 'COMPLETE',
  RollingBack = 'ROLLING_BACK',
  CreateFailed = 'CREATE_FAILED',
  Terminal = 'TERMINAL',
  RolledBack = 'ROLLED_BACK',
  Missing = 'MISSING',
}

export interface O5DeployerV1CFStackInput {
  // format: int32
  desiredCount?: number;
  parameters?: O5DeployerV1CloudFormationStackParameter[];
  snsTopics?: string[];
  stackName?: string;
  templateUrl?: string;
}

export interface O5DeployerV1CFStackOutput {
  lifecycle?: O5DeployerV1CFLifecycle;
  outputs?: O5DeployerV1KeyValue[];
}

export interface O5DeployerV1CloudFormationStackParameter {
  name?: string;
  source?: {
    // start oneOf
    resolve?: O5DeployerV1CloudFormationStackParameterType;
    value?: string;
    // end oneOf
  };
}

export interface O5DeployerV1CloudFormationStackParameterType {
  type?: {
    // start oneOf
    desiredCount?: O5DeployerV1CloudFormationStackParameterTypeDesiredCount;
    rulePriority?: O5DeployerV1CloudFormationStackParameterTypeRulePriority;
    // end oneOf
  };
}

export interface O5DeployerV1CloudFormationStackParameterTypeDesiredCount {}

export interface O5DeployerV1CloudFormationStackParameterTypeRulePriority {
  routeGroup?: O5ApplicationV1RouteGroup;
}

export interface O5DeployerV1CodeSourceType {
  type?: {
    // start oneOf
    github?: O5DeployerV1CodeSourceTypeGithub;
    // end oneOf
  };
}

export interface O5DeployerV1CodeSourceTypeGithub {
  branch?: string;
  owner?: string;
  repo?: string;
}

export interface O5DeployerV1DeploymentEvent {
  // format: uuid
  deploymentId?: string;
  event: O5DeployerV1DeploymentEventType;
  metadata: O5DeployerV1EventMetadata;
}

export interface O5DeployerV1DeploymentEventType {
  type?: {
    // start oneOf
    created?: O5DeployerV1DeploymentEventTypeCreated;
    done?: O5DeployerV1DeploymentEventTypeDone;
    error?: O5DeployerV1DeploymentEventTypeError;
    runSteps?: O5DeployerV1DeploymentEventTypeRunSteps;
    stackAvailable?: O5DeployerV1DeploymentEventTypeStackAvailable;
    stackWait?: O5DeployerV1DeploymentEventTypeStackWait;
    stackWaitFailure?: O5DeployerV1DeploymentEventTypeStackWaitFailure;
    stepResult?: O5DeployerV1DeploymentEventTypeStepResult;
    terminated?: O5DeployerV1DeploymentEventTypeTerminated;
    triggered?: O5DeployerV1DeploymentEventTypeTriggered;
    // end oneOf
  };
}

export interface O5DeployerV1DeploymentEventTypeCreated {
  spec?: O5DeployerV1DeploymentSpec;
}

export interface O5DeployerV1DeploymentEventTypeDone {}

export interface O5DeployerV1DeploymentEventTypeError {
  error?: string;
}

export interface O5DeployerV1DeploymentEventTypeRunSteps {}

export interface O5DeployerV1DeploymentEventTypeStackAvailable {
  stackOutput?: O5DeployerV1CFStackOutput;
}

export interface O5DeployerV1DeploymentEventTypeStackWait {}

export interface O5DeployerV1DeploymentEventTypeStackWaitFailure {
  error?: string;
}

export interface O5DeployerV1DeploymentEventTypeStepResult {
  error?: string;
  output?: O5DeployerV1StepOutputType;
  status?: O5DeployerV1StepStatus;
  stepId?: string;
}

export interface O5DeployerV1DeploymentEventTypeTerminated {}

export interface O5DeployerV1DeploymentEventTypeTriggered {}

export interface O5DeployerV1DeploymentFlags {
  cancelUpdates: boolean;
  dbOnly: boolean;
  infraOnly: boolean;
  quickMode: boolean;
  rotateCredentials: boolean;
}

export interface O5DeployerV1DeploymentSpec {
  appName?: string;
  databases?: O5DeployerV1PostgresSpec[];
  ecsCluster?: string;
  // format: uuid
  environmentId?: string;
  environmentName?: string;
  flags?: O5DeployerV1DeploymentFlags;
  parameters?: O5DeployerV1CloudFormationStackParameter[];
  snsTopics?: string[];
  templateUrl?: string;
  version?: string;
}

export interface O5DeployerV1DeploymentState {
  // format: date-time
  createdAt?: string;
  // format: uuid
  deploymentId?: string;
  spec?: O5DeployerV1DeploymentSpec;
  // format: uuid
  stackId?: string;
  stackName?: string;
  status?: O5DeployerV1DeploymentStatus;
  steps?: O5DeployerV1DeploymentStep[];
}

export enum O5DeployerV1DeploymentStatus {
  Unspecified = 'UNSPECIFIED',
  Queued = 'QUEUED',
  Triggered = 'TRIGGERED',
  Waiting = 'WAITING',
  Available = 'AVAILABLE',
  Running = 'RUNNING',
  Done = 'DONE',
  Failed = 'FAILED',
  Terminated = 'TERMINATED',
}

export interface O5DeployerV1DeploymentStep {
  dependsOn?: string[];
  error?: string;
  // format: uuid
  id?: string;
  name?: string;
  output?: O5DeployerV1StepOutputType;
  request?: O5DeployerV1StepRequestType;
  status?: O5DeployerV1StepStatus;
}

export interface O5DeployerV1EnvironmentEvent {
  // format: uuid
  environmentId?: string;
  event: O5DeployerV1EnvironmentEventType;
  metadata: O5DeployerV1EventMetadata;
}

export interface O5DeployerV1EnvironmentEventType {
  type?: {
    // start oneOf
    configured?: O5DeployerV1EnvironmentEventTypeConfigured;
    // end oneOf
  };
}

export interface O5DeployerV1EnvironmentEventTypeConfigured {
  config?: O5EnvironmentV1Environment;
}

export interface O5DeployerV1EnvironmentState {
  config?: O5EnvironmentV1Environment;
  // format: uuid
  environmentId?: string;
  status?: O5DeployerV1EnvironmentStatus;
}

export enum O5DeployerV1EnvironmentStatus {
  Unspecified = 'UNSPECIFIED',
  Active = 'ACTIVE',
}

export interface O5DeployerV1EventMetadata {
  actor?: O5DeployerV1Actor;
  // format: uuid
  eventId?: string;
  // format: date-time
  timestamp: string;
}

export interface O5DeployerV1KeyValue {
  name?: string;
  value?: string;
}

export interface O5DeployerV1PostgresSpec {
  dbExtensions?: string[];
  dbName?: string;
  migrationTaskOutputName?: string;
  rootSecretName?: string;
  secretOutputName?: string;
}

export interface O5DeployerV1StackConfig {
  codeSource?: O5DeployerV1CodeSourceType;
}

export interface O5DeployerV1StackDeployment {
  // format: uuid
  deploymentId?: string;
  version?: string;
}

export interface O5DeployerV1StackEvent {
  event: O5DeployerV1StackEventType;
  metadata: O5DeployerV1EventMetadata;
  // format: uuid
  stackId?: string;
}

export interface O5DeployerV1StackEventType {
  type?: {
    // start oneOf
    available?: O5DeployerV1StackEventTypeAvailable;
    configured?: O5DeployerV1StackEventTypeConfigured;
    deploymentCompleted?: O5DeployerV1StackEventTypeDeploymentCompleted;
    deploymentFailed?: O5DeployerV1StackEventTypeDeploymentFailed;
    triggered?: O5DeployerV1StackEventTypeTriggered;
    // end oneOf
  };
}

export interface O5DeployerV1StackEventTypeAvailable {}

export interface O5DeployerV1StackEventTypeConfigured {
  applicationName?: string;
  config?: O5DeployerV1StackConfig;
  environmentId?: string;
  environmentName?: string;
}

export interface O5DeployerV1StackEventTypeDeploymentCompleted {
  deployment?: O5DeployerV1StackDeployment;
}

export interface O5DeployerV1StackEventTypeDeploymentFailed {
  deployment?: O5DeployerV1StackDeployment;
  error?: string;
}

export interface O5DeployerV1StackEventTypeTriggered {
  applicationName?: string;
  deployment?: O5DeployerV1StackDeployment;
  environmentId?: string;
  environmentName?: string;
}

export interface O5DeployerV1StackState {
  // pattern: ^[a-z][a-z0-9]+$
  applicationName?: string;
  config?: O5DeployerV1StackConfig;
  currentDeployment?: O5DeployerV1StackDeployment;
  // format: uuid
  environmentId?: string;
  // pattern: ^[a-z][a-z0-9]+$
  environmentName?: string;
  queuedDeployments?: O5DeployerV1StackDeployment[];
  // format: uuid
  stackId?: string;
  // pattern: ^[a-z][a-z0-9]+-[a-z][a-z0-9]+$
  stackName?: string;
  status?: O5DeployerV1StackStatus;
}

export enum O5DeployerV1StackStatus {
  Unspecified = 'UNSPECIFIED',
  Creating = 'CREATING',
  Stable = 'STABLE',
  Available = 'AVAILABLE',
  Migrating = 'MIGRATING',
  Broken = 'BROKEN',
}

export interface O5DeployerV1StepOutputType {
  type?: {
    // start oneOf
    cfStatus?: O5DeployerV1StepOutputTypeCFStatus;
    // end oneOf
  };
}

export interface O5DeployerV1StepOutputTypeCFStatus {
  output?: O5DeployerV1CFStackOutput;
}

export interface O5DeployerV1StepRequestType {
  type?: {
    // start oneOf
    cfCreate?: O5DeployerV1StepRequestTypeCFCreate;
    cfPlan?: O5DeployerV1StepRequestTypeCFPlan;
    cfScale?: O5DeployerV1StepRequestTypeCFScale;
    cfUpdate?: O5DeployerV1StepRequestTypeCFUpdate;
    evalJoin?: O5DeployerV1StepRequestTypeEvalJoin;
    pgCleanup?: O5DeployerV1StepRequestTypePGCleanup;
    pgEvaluate?: O5DeployerV1StepRequestTypePGEvaluate;
    pgMigrate?: O5DeployerV1StepRequestTypePGMigrate;
    pgUpsert?: O5DeployerV1StepRequestTypePGUpsert;
    // end oneOf
  };
}

export interface O5DeployerV1StepRequestTypeCFCreate {
  output?: O5DeployerV1CFStackOutput;
  spec?: O5DeployerV1CFStackInput;
}

export interface O5DeployerV1StepRequestTypeCFPlan {
  spec?: O5DeployerV1CFStackInput;
}

export interface O5DeployerV1StepRequestTypeCFScale {
  // format: int32
  desiredCount?: number;
  stackName?: string;
}

export interface O5DeployerV1StepRequestTypeCFUpdate {
  output?: O5DeployerV1CFStackOutput;
  spec?: O5DeployerV1CFStackInput;
}

export interface O5DeployerV1StepRequestTypeEvalJoin {}

export interface O5DeployerV1StepRequestTypePGCleanup {
  spec?: O5DeployerV1PostgresSpec;
}

export interface O5DeployerV1StepRequestTypePGEvaluate {
  dbName?: string;
}

export interface O5DeployerV1StepRequestTypePGMigrate {
  infraOutputStepId?: string;
  spec?: O5DeployerV1PostgresSpec;
}

export interface O5DeployerV1StepRequestTypePGUpsert {
  infraOutputStepId?: string;
  spec?: O5DeployerV1PostgresSpec;
}

export enum O5DeployerV1StepStatus {
  Unspecified = 'UNSPECIFIED',
  Blocked = 'BLOCKED',
  Active = 'ACTIVE',
  Done = 'DONE',
  Failed = 'FAILED',
}

export interface O5DeployerV1TriggerDeploymentRequestGithubSource {
  commit: string;
  owner: string;
  repo: string;
}

export interface O5EnvironmentV1AWS {
  ecsClusterName?: string;
  ecsRepo?: string;
  ecsTaskExecutionRole?: string;
  environmentLinks?: O5EnvironmentV1AWSLink[];
  grantPrincipals?: O5EnvironmentV1AWSGrantPrincipal[];
  hostHeader?: string;
  listenerArn?: string;
  o5DeployerAssumeRole?: string;
  o5DeployerGrantRoles?: string[];
  rdsHosts?: O5EnvironmentV1RDSHost[];
  region?: string;
  s3BucketNamespace?: string;
  sesIdentity?: O5EnvironmentV1SESIdentity;
  sidecarImageRepo?: string;
  sidecarImageVersion?: string;
  snsPrefix?: string;
  vpcId?: string;
}

export interface O5EnvironmentV1AWSGrantPrincipal {
  name?: string;
  roleArn?: string;
}

export interface O5EnvironmentV1AWSLink {
  fullName?: string;
  snsPrefix?: string;
}

export interface O5EnvironmentV1CustomVariable {
  name?: string;
  src?: {
    // start oneOf
    join?: O5EnvironmentV1CustomVariableJoin;
    value?: string;
    // end oneOf
  };
}

export interface O5EnvironmentV1CustomVariableJoin {
  delimiter?: string;
  values?: string[];
}

export interface O5EnvironmentV1Environment {
  corsOrigins?: string[];
  // pattern: ^[a-z][a-z0-9]+$
  fullName?: string;
  provider?: {
    // start oneOf
    aws?: O5EnvironmentV1AWS;
    // end oneOf
  };
  trustJwks?: string[];
  vars?: O5EnvironmentV1CustomVariable[];
}

export interface O5EnvironmentV1RDSHost {
  secretName?: string;
  serverGroup?: string;
}

export interface O5EnvironmentV1SESIdentity {
  recipients?: string[];
  senders?: string[];
}

export interface PsmListV1And {
  filters?: PsmListV1Filter[];
}

export interface PsmListV1Field {
  name?: string;
  type?: {
    // start oneOf
    range?: PsmListV1Range;
    value?: string;
    // end oneOf
  };
}

export interface PsmListV1Filter {
  type?: {
    // start oneOf
    and?: PsmListV1And;
    field?: PsmListV1Field;
    or?: PsmListV1Or;
    // end oneOf
  };
}

export interface PsmListV1Or {
  filters?: PsmListV1Filter[];
}

export interface PsmListV1PageRequest {
  // format: int64
  pageSize?: string;
  token?: string;
}

export interface PsmListV1PageResponse {
  nextToken?: string;
}

export interface PsmListV1QueryRequest {
  filters?: PsmListV1Filter[];
  searches?: PsmListV1Search[];
  sorts?: PsmListV1Sort[];
}

export interface PsmListV1Range {
  max?: string;
  min?: string;
}

export interface PsmListV1Search {
  field?: string;
  value?: string;
}

export interface PsmListV1Sort {
  descending: boolean;
  field?: string;
}

export interface O5AuthV1WhoamiResponse {
  realmAccess?: O5AuthV1RealmAccess[];
}

export interface O5DanteV1GetDeadMessageResponse {
  events?: O5DanteV1DeadMessageEvent[];
  message: O5DanteV1DeadMessageState;
}

export interface O5DanteV1GetDeadMessageRequest {
  // format: uuid
  messageId?: string;
}

export interface O5DanteV1ListDeadMessagesResponse {
  messages?: O5DanteV1DeadMessageState[];
  page?: PsmListV1PageResponse;
}

export interface O5DanteV1ListDeadMessagesRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
}

export interface O5DanteV1ListDeadMessageEventsResponse {
  events?: O5DanteV1DeadMessageEvent[];
  page?: PsmListV1PageResponse;
}

export interface O5DanteV1ListDeadMessageEventsRequest {
  // format: uuid
  messageId?: string;
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
}

export interface O5DanteV1UpdateDeadMessageResponse {
  message: O5DanteV1DeadMessageState;
}

export interface O5DanteV1UpdateDeadMessageRequest {
  message: O5DanteV1DeadMessageSpec;
  // format: uuid
  replacesVersionId?: string;
  // format: uuid
  versionId?: string;
  // format: uuid
  messageId?: string;
}

export interface O5DanteV1ReplayDeadMessageResponse {
  message: O5DanteV1DeadMessageState;
}

export interface O5DanteV1ReplayDeadMessageRequest {
  // format: uuid
  messageId?: string;
}

export interface O5DanteV1RejectDeadMessageResponse {
  message: O5DanteV1DeadMessageState;
}

export interface O5DanteV1RejectDeadMessageRequest {
  reason?: string;
  // format: uuid
  messageId?: string;
}

export interface O5DeployerV1TriggerDeploymentResponse {
  // format: uuid
  deploymentId?: string;
  // format: uuid
  environmentId?: string;
  environmentName?: string;
}

export interface O5DeployerV1TriggerDeploymentRequest {
  environment?: string;
  flags?: O5DeployerV1DeploymentFlags;
  source?: {
    // start oneOf
    github?: O5DeployerV1TriggerDeploymentRequestGithubSource;
    // end oneOf
  };
  // format: uuid
  deploymentId?: string;
}

export interface O5DeployerV1TerminateDeploymentResponse {}

export interface O5DeployerV1TerminateDeploymentRequest {
  // format: uuid
  deploymentId?: string;
}

export interface O5DeployerV1UpsertEnvironmentResponse {
  state: O5DeployerV1EnvironmentState;
}

export interface O5DeployerV1UpsertEnvironmentRequest {
  src?: {
    // start oneOf
    config?: O5EnvironmentV1Environment;
    // format: byte
    configJson?: string;
    // format: byte
    configYaml?: string;
    // end oneOf
  };
  environmentId?: string;
}

export interface O5DeployerV1UpsertStackResponse {
  state: O5DeployerV1StackState;
}

export interface O5DeployerV1UpsertStackRequest {
  config: O5DeployerV1StackConfig;
  stackId?: string;
}

export interface O5DeployerV1GetDeploymentResponse {
  events?: O5DeployerV1DeploymentEvent[];
  state?: O5DeployerV1DeploymentState;
}

export interface O5DeployerV1GetDeploymentRequest {
  deploymentId?: string;
}

export interface O5DeployerV1ListDeploymentEventsResponse {
  events?: O5DeployerV1DeploymentEvent[];
  page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ListDeploymentEventsRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
  deploymentId?: string;
}

export interface O5DeployerV1ListDeploymentsResponse {
  deployments?: O5DeployerV1DeploymentState[];
  page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ListDeploymentsRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1GetStackResponse {
  events?: O5DeployerV1StackEvent[];
  state?: O5DeployerV1StackState;
}

export interface O5DeployerV1GetStackRequest {
  stackId?: string;
}

export interface O5DeployerV1ListStacksResponse {
  page?: PsmListV1PageResponse;
  stacks?: O5DeployerV1StackState[];
}

export interface O5DeployerV1ListStacksRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1ListStackEventsResponse {
  events?: O5DeployerV1StackEvent[];
  page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ListStackEventsRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
  stackId?: string;
}

export interface O5DeployerV1ListEnvironmentsResponse {
  environments?: O5DeployerV1EnvironmentState[];
  page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ListEnvironmentsRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
}

export interface O5DeployerV1GetEnvironmentResponse {
  events?: O5DeployerV1EnvironmentEvent[];
  state?: O5DeployerV1EnvironmentState;
}

export interface O5DeployerV1GetEnvironmentRequest {
  environmentId?: string;
}

export interface O5DeployerV1ListEnvironmentEventsResponse {
  events?: O5DeployerV1EnvironmentEvent[];
  page?: PsmListV1PageResponse;
}

export interface O5DeployerV1ListEnvironmentEventsRequest {
  page?: PsmListV1PageRequest;
  query?: PsmListV1QueryRequest;
  environmentId?: string;
}
