/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/application/v1/application.proto */

export interface O5ApplicationV1Application {
    name?: string;
    targets?: O5ApplicationV1Target[];
    blobstores?: O5ApplicationV1Blobstore[];
    databases?: O5ApplicationV1Database[];
    runtimes?: O5ApplicationV1Runtime[];
    secrets?: O5ApplicationV1Secret[];
    deploymentConfig?: O5ApplicationV1DeploymentConfig;
    awsConfig?: O5ApplicationV1AwsConfig;
}

export interface O5ApplicationV1DeploymentConfig {
    quickMode?: boolean;
}

export interface O5ApplicationV1Target {
    name?: string;
}

export interface O5ApplicationV1Blobstore {
    name?: string;
    grants?: O5ApplicationV1Grant[];
}

export interface O5ApplicationV1Grant {
    principal?: string;
}

export interface O5ApplicationV1Database {
    name?: string;
    // start oneof "engine"
    engine?: {
        postgres?: {
            dbName?: string;
            serverGroup?: string;
            dbExtensions?: string[];
            migrateContainer?: O5ApplicationV1Container;
            runOutbox?: boolean;
        };
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
    subdomains?: string[];
    protocol?: O5ApplicationV1RouteProtocol;
    targetContainer?: string;
    bypassIngress?: boolean;
    // format: int64
    port?: string;
    routeGroup?: O5ApplicationV1RouteGroup;
}

export enum O5ApplicationV1RouteProtocol {
    Unspecified = 'UNSPECIFIED',
    Http = 'HTTP',
    Grpc = 'GRPC'
}

export enum O5ApplicationV1RouteGroup {
    Unspecified = 'UNSPECIFIED',
    First = 'FIRST',
    Normal = 'NORMAL',
    Fallback = 'FALLBACK'
}

export enum O5ApplicationV1Demand {
    Unspecified = 'UNSPECIFIED',
    Light = 'LIGHT',
    Medium = 'MEDIUM',
    Heavy = 'HEAVY'
}

export interface O5ApplicationV1Container {
    name?: string;
    // start oneof "source"
    source?: {
        imageUrl?: string;
        image?: {
            name?: string;
            tag?: string;
            registry?: string;
        };
    }; // end oneof "source"
    command?: string[];
    demand?: O5ApplicationV1Demand;
    envVars?: O5ApplicationV1EnvironmentVariable[];
    mountDockerSocket?: boolean;
}

export interface O5ApplicationV1EnvironmentVariable {
    name?: string;
    // start oneof "spec"
    spec?: {
        value?: string;
        database?: O5ApplicationV1DatabaseEnvVar;
        blobstore?: O5ApplicationV1BlobstoreEnvVar;
        envMap?: O5ApplicationV1MapEnvVar;
        fromEnv?: O5ApplicationV1FromEnvVar;
        secret?: O5ApplicationV1SecretEnvVar;
        o5?: O5ApplicationV1O5Var;
    }; // end oneof "spec"
}

export interface O5ApplicationV1DatabaseEnvVar {
    databaseName?: string;
}

export interface O5ApplicationV1BlobstoreEnvVar {
    name?: string;
    subPath?: string;
    // start oneof "format"
    format?: {
        s3Direct?: boolean;
    }; // end oneof "format"
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

export interface O5ApplicationV1AwsConfig {
    ses?: {
        sendEmail?: boolean;
    };
}

export enum O5ApplicationV1O5Var {
    Unspecified = 'UNSPECIFIED',
    AdapterEndpoint = 'ADAPTER_ENDPOINT'
}

