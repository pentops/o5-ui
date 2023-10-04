/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/environment/v1/environment.proto at 2023-10-04T23:21:20.588Z */

export interface O5EnvironmentV1Environment {
    fullName?: string;
    // start oneof "provider"
    aws?: O5EnvironmentV1Aws; // end oneof "provider"
}

export interface O5EnvironmentV1Aws {
    listenerArn?: string;
    ecsClusterName?: string;
    ecsRepo?: string;
    ecsTaskExecutionRole?: string;
    vpcId?: string;
}

