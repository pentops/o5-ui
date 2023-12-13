/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/deployer/v1/event.proto */

export interface O5DeployerV1Actor {
}

export interface O5DeployerV1EventMetadata {
    eventId?: string;
    // format: date-time
    timestamp?: string;
    actor?: O5DeployerV1Actor;
}

