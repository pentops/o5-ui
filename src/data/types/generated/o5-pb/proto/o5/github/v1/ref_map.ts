/**
 * DO NOT EDIT -- GENERATED AUTOMATICALLY via convert-proto-to-ts. Run `pnpm generate:types` from the project root to regenerate.
 * Built from: o5-pb/proto/o5/github/v1/ref_map.proto at 2023-10-24T23:07:49.767Z */

export interface O5GithubV1DeployerConfig {
    refs?: O5GithubV1RefLink[];
    targetEnvironments?: string[];
}

export interface O5GithubV1RefLink {
    owner?: string;
    repo?: string;
    refMatch?: string;
    targets?: string[];
}

