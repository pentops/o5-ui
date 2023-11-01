/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/application/v1/application.proto at 2023-11-01T17:25:13.638Z */

export interface O5ApplicationV1Application {
    name?: string;
    blobstores?: O5ApplicationV1Blobstore[];
    databases?: O5ApplicationV1Database[];
    runtimes?: O5ApplicationV1Runtime[];
    secrets?: O5ApplicationV1Secret[];
}

export interface O5ApplicationV1Target {
    name?: string;
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
    routes?: O5ApplicationV1Route[];
    subscriptions?: O5ApplicationV1Subscription[];
    grantMetaDeployPermissions?: boolean;
}

export interface O5ApplicationV1Subscription {
    name?: string;
    envName?: string;
    targetContainer?: string;
    // format: int64
    port?: string;
}

export interface O5ApplicationV1Route {
    prefix?: string;
    protocol?: O5ApplicationV1RouteProtocol;
    targetContainer?: string;
    bypassIngress?: boolean;
    // format: int64
    port?: string;
    routeGroup?: O5ApplicationV1RouteGroup;
}

export enum O5ApplicationV1RouteProtocol {
    Unspecified = 'ROUTE_PROTOCOL_UNSPECIFIED',
    Http = 'ROUTE_PROTOCOL_HTTP',
    Grpc = 'ROUTE_PROTOCOL_GRPC'
}

export enum O5ApplicationV1RouteGroup {
    Unspecified = 'ROUTE_GROUP_UNSPECIFIED',
    First = 'ROUTE_GROUP_FIRST',
    Normal = 'ROUTE_GROUP_NORMAL',
    Fallback = 'ROUTE_GROUP_FALLBACK'
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
        registry?: string;
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
    fromEnv?: O5ApplicationV1FromEnvVar;
    secret?: O5ApplicationV1SecretEnvVar; // end oneof "spec"
}

export interface O5ApplicationV1DatabaseEnvVar {
    databaseName?: string;
}

export interface O5ApplicationV1BlobstoreEnvVar {
    name?: string;
    subPath?: string;
    // start oneof "format"
    s3Direct?: boolean; // end oneof "format"
}

export interface O5ApplicationV1MapEnvVar {
}

export interface O5ApplicationV1FromEnvVar {
    name?: string;
}

export interface O5ApplicationV1SecretEnvVar {
    secretName?: string;
    jsonKey?: string;
}

export interface O5ApplicationV1Secret {
    name?: string;
}

