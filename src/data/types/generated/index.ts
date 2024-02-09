/**
 * DO NOT EDIT! Types generated from jdef.json */

export interface O5ApplicationV1BlobstoreEnvVar {
  format?: {
    // start oneOf
    s3Direct?: boolean;
    // end oneOf
  };
  name?: string;
  subPath?: string;
}

export interface O5ApplicationV1Container {
  command?: string[];
  demand?: O5ApplicationV1Demand;
  envVars?: O5ApplicationV1EnvironmentVariable[];
  mountDockerSocket: boolean;
  name?: string;
  source?: {
    // start oneOf
    image?: O5ApplicationV1ContainerImage;
    imageUrl?: string;
    // end oneOf
  };
}

export interface O5ApplicationV1ContainerImage {
  name?: string;
  registry?: string;
  tag?: string;
}

export interface O5ApplicationV1Database {
  engine?: {
    // start oneOf
    postgres?: O5ApplicationV1DatabasePostgres;
    // end oneOf
  };
  name?: string;
}

export interface O5ApplicationV1DatabasePostgres {
  dbExtensions?: string[];
  dbName?: string;
  migrateContainer?: O5ApplicationV1Container;
  runOutbox: boolean;
  serverGroup?: string;
}

export interface O5ApplicationV1DatabaseEnvVar {
  databaseName?: string;
}

export enum O5ApplicationV1Demand {
  Unspecified = 'UNSPECIFIED',
  Light = 'LIGHT',
  Medium = 'MEDIUM',
  Heavy = 'HEAVY',
}

export interface O5ApplicationV1EnvironmentVariable {
  name?: string;
  spec?: {
    // start oneOf
    blobstore?: O5ApplicationV1BlobstoreEnvVar;
    database?: O5ApplicationV1DatabaseEnvVar;
    envMap?: O5ApplicationV1MapEnvVar;
    fromEnv?: O5ApplicationV1FromEnvVar;
    o5?: O5ApplicationV1O5Var;
    secret?: O5ApplicationV1SecretEnvVar;
    value?: string;
    // end oneOf
  };
}

export interface O5ApplicationV1FromEnvVar {
  name?: string;
}

export interface O5ApplicationV1MapEnvVar {}

export enum O5ApplicationV1O5Var {
  Unspecified = 'UNSPECIFIED',
  AdapterEndpoint = 'ADAPTER_ENDPOINT',
}

export enum O5ApplicationV1RouteGroup {
  Unspecified = 'UNSPECIFIED',
  First = 'FIRST',
  Normal = 'NORMAL',
  Fallback = 'FALLBACK',
}

export interface O5ApplicationV1SecretEnvVar {
  jsonKey?: string;
  secretName?: string;
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
  createdAt?: string;
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

export interface O5DeployerV1DatabaseMigration {
  dbName?: string;
  migrationId?: string;
}

export interface O5DeployerV1DatabaseMigrationState {
  dbName?: string;
  migrationId?: string;
  rotateCredentials: boolean;
  status?: O5DeployerV1DatabaseMigrationStatus;
}

export enum O5DeployerV1DatabaseMigrationStatus {
  Unspecified = 'UNSPECIFIED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Cleanup = 'CLEANUP',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
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
    dataMigrated?: O5DeployerV1DeploymentEventTypeDataMigrated;
    dbMigrateStatus?: O5DeployerV1DeploymentEventTypeDBMigrateStatus;
    done?: O5DeployerV1DeploymentEventTypeDone;
    error?: O5DeployerV1DeploymentEventTypeError;
    migrateData?: O5DeployerV1DeploymentEventTypeMigrateData;
    stackCreate?: O5DeployerV1DeploymentEventTypeStackCreate;
    stackScale?: O5DeployerV1DeploymentEventTypeStackScale;
    stackStatus?: O5DeployerV1DeploymentEventTypeStackStatus;
    stackTrigger?: O5DeployerV1DeploymentEventTypeStackTrigger;
    stackUpsert?: O5DeployerV1DeploymentEventTypeStackUpsert;
    stackWait?: O5DeployerV1DeploymentEventTypeStackWait;
    terminated?: O5DeployerV1DeploymentEventTypeTerminated;
    triggered?: O5DeployerV1DeploymentEventTypeTriggered;
    // end oneOf
  };
}

export interface O5DeployerV1DeploymentEventTypeCreated {
  spec?: O5DeployerV1DeploymentSpec;
}

export interface O5DeployerV1DeploymentEventTypeDBMigrateStatus {
  dbName?: string;
  error?: string;
  migrationId?: string;
  status?: O5DeployerV1DatabaseMigrationStatus;
}

export interface O5DeployerV1DeploymentEventTypeDataMigrated {}

export interface O5DeployerV1DeploymentEventTypeDone {}

export interface O5DeployerV1DeploymentEventTypeError {
  error?: string;
}

export interface O5DeployerV1DeploymentEventTypeMigrateData {
  databases?: O5DeployerV1DatabaseMigration[];
}

export interface O5DeployerV1DeploymentEventTypeStackCreate {}

export interface O5DeployerV1DeploymentEventTypeStackScale {
  // format: int32
  desiredCount?: number;
}

export interface O5DeployerV1DeploymentEventTypeStackStatus {
  deploymentPhase?: string;
  fullStatus?: string;
  lifecycle?: O5DeployerV1StackLifecycle;
  stackOutput?: O5DeployerV1KeyValue[];
}

export interface O5DeployerV1DeploymentEventTypeStackTrigger {
  phase?: string;
}

export interface O5DeployerV1DeploymentEventTypeStackUpsert {}

export interface O5DeployerV1DeploymentEventTypeStackWait {}

export interface O5DeployerV1DeploymentEventTypeTerminated {}

export interface O5DeployerV1DeploymentEventTypeTriggered {}

export interface O5DeployerV1DeploymentSpec {
  appName?: string;
  cancelUpdates: boolean;
  databases?: O5DeployerV1PostgresDatabase[];
  ecsCluster?: string;
  environmentName?: string;
  parameters?: O5DeployerV1CloudFormationStackParameter[];
  quickMode: boolean;
  rotateCredentials: boolean;
  snsTopics?: O5DeployerV1SNSTopic[];
  templateUrl?: string;
  version?: string;
}

export interface O5DeployerV1DeploymentState {
  dataMigrations?: O5DeployerV1DatabaseMigrationState[];
  deploymentId?: string;
  lastStackLifecycle?: O5DeployerV1StackLifecycle;
  spec?: O5DeployerV1DeploymentSpec;
  stackId?: string;
  stackName?: string;
  stackOutput?: O5DeployerV1KeyValue[];
  status?: O5DeployerV1DeploymentStatus;
  waitingOnRemotePhase?: string;
}

export enum O5DeployerV1DeploymentStatus {
  Unspecified = 'UNSPECIFIED',
  Queued = 'QUEUED',
  Triggered = 'TRIGGERED',
  Waiting = 'WAITING',
  Available = 'AVAILABLE',
  ScalingDown = 'SCALING_DOWN',
  ScaledDown = 'SCALED_DOWN',
  InfraMigrate = 'INFRA_MIGRATE',
  InfraMigrated = 'INFRA_MIGRATED',
  DbMigrating = 'DB_MIGRATING',
  DbMigrated = 'DB_MIGRATED',
  ScalingUp = 'SCALING_UP',
  ScaledUp = 'SCALED_UP',
  Creating = 'CREATING',
  Upserting = 'UPSERTING',
  Upserted = 'UPSERTED',
  Done = 'DONE',
  Failed = 'FAILED',
  Terminated = 'TERMINATED',
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

export interface O5DeployerV1PostgresDatabase {
  database?: O5ApplicationV1Database;
  migrationTaskOutputName?: string;
  rdsHost?: O5EnvironmentV1RDSHost;
  secretOutputName?: string;
}

export interface O5DeployerV1SNSTopic {
  name?: string;
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
    deploymentCompleted?: O5DeployerV1StackEventTypeDeploymentCompleted;
    deploymentFailed?: O5DeployerV1StackEventTypeDeploymentFailed;
    triggered?: O5DeployerV1StackEventTypeTriggered;
    // end oneOf
  };
}

export interface O5DeployerV1StackEventTypeAvailable {}

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
  environmentName?: string;
}

export enum O5DeployerV1StackLifecycle {
  Unspecified = 'UNSPECIFIED',
  Progress = 'PROGRESS',
  Complete = 'COMPLETE',
  RollingBack = 'ROLLING_BACK',
  CreateFailed = 'CREATE_FAILED',
  Terminal = 'TERMINAL',
  RolledBack = 'ROLLED_BACK',
  Missing = 'MISSING',
}

export interface O5DeployerV1StackState {
  applicationName?: string;
  currentDeployment?: O5DeployerV1StackDeployment;
  environmentName?: string;
  queuedDeployments?: O5DeployerV1StackDeployment[];
  // format: uuid
  stackId?: string;
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

export interface O5DeployerV1TriggerDeploymentRequestGithubSource {
  commit: string;
  owner: string;
  repo: string;
}

export interface O5EnvironmentV1RDSHost {
  secretName?: string;
  serverGroup?: string;
}

export interface PsmListV1Filter {
  field?: string;
  type?: {
    // start oneOf
    range?: PsmListV1Range;
    value?: string;
    // end oneOf
  };
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
  search?: PsmListV1Search[];
  sort?: PsmListV1Sort[];
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
}

export interface O5DanteV1ListDeadMessageEventsResponse {
  events?: O5DanteV1DeadMessageEvent[];
}

export interface O5DanteV1ListDeadMessageEventsRequest {
  // format: uuid
  messageId?: string;
}

export interface O5DeployerV1TriggerDeploymentResponse {}

export interface O5DeployerV1TriggerDeploymentRequest {
  environmentName: string;
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
