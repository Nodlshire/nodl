export type DeterministicErrorCode = 'NETWORK_UNAVAILABLE' | 'INVALID_PARAMS' | 'REMOTE_ERROR' | 'RATE_LIMITED' | 'UNAUTHORIZED' | 'DETERMINISM_VIOLATION' | 'NOT_IMPLEMENTED';
export interface IntegrationResult<T> {
    data?: T;
    result?: T;
    ok?: boolean;
    payloadHash: string;
    integrityProof: string;
    errorCode?: DeterministicErrorCode;
}
export interface CapabilitySet {
    canFetch: boolean;
    canSubmit: boolean;
    canValidate: boolean;
}
export interface DeterminismProfile {
    isPurelyDeterministic: boolean;
    reliesOnTime: boolean;
    reliesOnRandomness: boolean;
}
export interface SecurityProfile {
    requiresSecrets: boolean;
    readOnly: boolean;
    writeEnabled: boolean;
}
export interface IntegrationAdapter {
    name: string;
    version: string;
    fetch(params: any): Promise<IntegrationResult<any>>;
    submit(params: any): Promise<IntegrationResult<any>>;
    validate(params: any): Promise<IntegrationResult<boolean>>;
    capabilities(): CapabilitySet;
    determinismProfile(): DeterminismProfile;
    securityProfile(): SecurityProfile;
}
