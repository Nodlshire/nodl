import { IntegrationAdapter, CapabilitySet, DeterminismProfile, SecurityProfile } from './adapter';
export interface IntegrationMetadata {
    name: string;
    version: string;
    capabilities: CapabilitySet;
    determinismProfile: DeterminismProfile;
    securityProfile: SecurityProfile;
}
export declare class IntegrationRegistry {
    private adapters;
    registerIntegration(adapter: IntegrationAdapter): void;
    getIntegration(name: string): IntegrationAdapter;
    listIntegrations(): IntegrationMetadata[];
    validateIntegrationCapabilities(name: string, requiredCaps: Partial<CapabilitySet>): boolean;
}
