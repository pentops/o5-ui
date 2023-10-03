/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: proto/o5/application/v1/application.proto at 2023-10-03T17:32:35.931Z */

export interface O5ApplicationV1Application {
    name?: string;
    subEnvironments?: string[];
    subscriptions?: O5ApplicationV1Subscription[];
    targets?: O5ApplicationV1Target[];
    ingress?: O5ApplicationV1Ingress[];
    blobstores?: O5ApplicationV1Blobstore[];
    databases?: O5ApplicationV1Database[];
    runtimes?: O5ApplicationV1Runtime[];
}

export interface O5ApplicationV1Ingress {
    name?: string;
    httpRoutes?: O5ApplicationV1HttpRoute[];
    grpcRoutes?: O5ApplicationV1GrpcRoute[];
}

export interface O5ApplicationV1HttpRoute {
    prefix?: string;
    targetRuntime?: string;
}

export interface O5ApplicationV1GrpcRoute {
    prefix?: string;
    targetRuntime?: string;
}

export enum O5ApplicationV1Topology {
    Unspecified = 'TOPOLOGY_UNSPECIFIED',
    Broadcast = 'TOPOLOGY_BROADCAST',
    Unicast = 'TOPOLOGY_UNICAST',
    Reply = 'TOPOLOGY_REPLY'
}

export interface O5ApplicationV1Subscription {
    name?: string;
    topology?: O5ApplicationV1Topology;
}

export interface O5ApplicationV1Target {
    name?: string;
    topology?: O5ApplicationV1Topology;
}

export interface O5ApplicationV1Blobstore {
    name?: string;
}

export interface O5ApplicationV1Database {
    name?: string;
    // start oneof "engine"
    postgres?: {
        dbName?: string;
        serverGroup?: string;
        dbExtensions?: string[];
        migrateContainer?: O5ApplicationV1Container;
    }; // end oneof "engine"
}

export interface O5ApplicationV1Runtime {
    name?: string;
    containers?: O5ApplicationV1Container[];
}

export enum O5ApplicationV1Demand {
    Unspecified = 'DEMAND_UNSPECIFIED',
    Light = 'DEMAND_LIGHT',
    Medium = 'DEMAND_MEDIUM',
    Heavy = 'DEMAND_HEAVY'
}

export interface O5ApplicationV1Container {
    name?: string;
    // start oneof "source"
    imageUrl?: string;
    image?: {
        name?: string;
        tag?: string;
    }; // end oneof "source"
    command?: string[];
    demand?: O5ApplicationV1Demand;
    envVars?: O5ApplicationV1EnvironmentVariable[];
}

export interface O5ApplicationV1EnvironmentVariable {
    name?: string;
    // start oneof "spec"
    database?: O5ApplicationV1DatabaseEnvVar;
    blobstore?: O5ApplicationV1BlobstoreEnvVar;
    envMap?: O5ApplicationV1MapEnvVar;
    fromEnv?: O5ApplicationV1FromEnvVar; // end oneof "spec"
}

export interface O5ApplicationV1DatabaseEnvVar {
    databaseName?: string;
}

export interface O5ApplicationV1BlobstoreEnvVar {
}

export interface O5ApplicationV1MapEnvVar {
}

export interface O5ApplicationV1FromEnvVar {
}

