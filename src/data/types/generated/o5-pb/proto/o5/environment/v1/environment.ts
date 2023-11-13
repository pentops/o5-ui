/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/environment/v1/environment.proto */

export interface O5EnvironmentV1Environment {
    fullName?: string;
    // start oneof "provider"
    provider?: {
        aws?: O5EnvironmentV1Aws;
    }; // end oneof "provider"
    trustJwks?: string[];
    vars?: O5EnvironmentV1CustomVariable[];
}

export interface O5EnvironmentV1CustomVariable {
    name?: string;
    // start oneof "src"
    src?: {
        value?: string;
        join?: {
            delimiter?: string;
            values?: string[];
        };
    }; // end oneof "src"
}

export interface O5EnvironmentV1Aws {
    listenerArn?: string;
    ecsClusterName?: string;
    ecsRepo?: string;
    ecsTaskExecutionRole?: string;
    vpcId?: string;
    o5DeployerAssumeRole?: string;
    o5DeployerGrantRoles?: string[];
    hostHeader?: string;
    rdsHosts?: O5EnvironmentV1RdsHost[];
    environmentLinks?: O5EnvironmentV1AwsLink[];
}

export interface O5EnvironmentV1AwsLink {
    fullName?: string;
    snsPrefix?: string;
}

export interface O5EnvironmentV1RdsHost {
    serverGroup?: string;
    secretName?: string;
}

