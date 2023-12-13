/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/application.proto */

import type { O5EnvironmentV1RdsHost } from '../../environment/v1/environment';
import type { O5ApplicationV1Database, O5ApplicationV1RouteGroup } from '../../application/v1/application';

export interface O5DeployerV1PostgresDatabase {
    database?: O5ApplicationV1Database;
    migrationTaskOutputName?: string;
    secretOutputName?: string;
    rdsHost?: O5EnvironmentV1RdsHost;
}

export interface O5DeployerV1Parameter {
    name?: string;
    type?: string;
    description?: string;
    source?: O5DeployerV1ParameterSourceType;
    args?: string[];
}

export interface O5DeployerV1ParameterSourceType {
    // start oneof "type"
    type?: {
        static?: {
            value?: string;
        };
        wellKnown?: {
            name?: string;
        };
        rulePriority?: {
            routeGroup?: O5ApplicationV1RouteGroup;
        };
        desiredCount?: {};
        crossEnvSns?: {
            envName?: string;
        };
        envVar?: {
            name?: string;
        };
    }; // end oneof "type"
}

export interface O5DeployerV1SnsTopic {
    name?: string;
}

export interface O5DeployerV1KeyValue {
    name?: string;
    value?: string;
}

export interface O5DeployerV1CloudFormationStackParameter {
    name?: string;
    // start oneof "source"
    source?: {
        value?: string;
        resolve?: O5DeployerV1CloudFormationStackParameterType;
    }; // end oneof "source"
}

export interface O5DeployerV1CloudFormationStackParameterType {
    // start oneof "type"
    type?: {
        rulePriority?: {
            routeGroup?: O5ApplicationV1RouteGroup;
        };
        desiredCount?: {};
    }; // end oneof "type"
}

