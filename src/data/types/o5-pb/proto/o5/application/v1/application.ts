/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/application/v1/application.proto at 2023-10-04T23:21:20.588Z */

export interface O5ApplicationV1Application {
    name?: string;
    blobstores?: O5ApplicationV1Blobstore[];
    databases?: O5ApplicationV1Database[];
    runtimes?: O5ApplicationV1Runtime[];
}

export interface O5ApplicationV1Route {
    prefix?: string;
    targetContainer?: string;
    bypassIngress?: boolean;
    // format: int64
    port?: string;
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
    directIngress?: boolean;
    containers?: O5ApplicationV1Container[];
    httpRoutes?: O5ApplicationV1Route[];
    grpcRoutes?: O5ApplicationV1Route[];
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
    value?: string;
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

