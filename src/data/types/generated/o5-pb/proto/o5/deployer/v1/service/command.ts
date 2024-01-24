/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/service/command.proto */

export interface O5DeployerV1ServiceTriggerDeploymentRequest {
    deploymentId?: string;
    environmentName?: string;
    // start oneof "source"
    source?: {
        github?: {
            owner?: string;
            repo?: string;
            commit?: string;
        };
    }; // end oneof "source"
}

export interface O5DeployerV1ServiceTriggerDeploymentResponse {
}

