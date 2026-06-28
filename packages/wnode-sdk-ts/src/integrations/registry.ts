import { IntegrationAdapter, CapabilitySet, DeterminismProfile, SecurityProfile } from './adapter';

export interface IntegrationMetadata {
  name: string;
  version: string;
  capabilities: CapabilitySet;
  determinismProfile: DeterminismProfile;
  securityProfile: SecurityProfile;
}

export class IntegrationRegistry {
  private adapters: Map<string, IntegrationAdapter> = new Map();

  public registerIntegration(adapter: IntegrationAdapter): void {
    if (this.adapters.has(adapter.name)) {
      throw new Error(`Integration ${adapter.name} is already registered.`);
    }
    
    // Basic validation of determinism profile
    const profile = adapter.determinismProfile();
    if (!profile.isPurelyDeterministic && profile.reliesOnRandomness) {
      throw new Error(`Integration ${adapter.name} violates strict determinism invariants (relies on randomness).`);
    }

    this.adapters.set(adapter.name, adapter);
  }

  public getIntegration(name: string): IntegrationAdapter {
    const adapter = this.adapters.get(name);
    if (!adapter) {
      throw new Error(`Integration ${name} not found.`);
    }
    return adapter;
  }

  public listIntegrations(): IntegrationMetadata[] {
    // Return sorted deterministically by name
    const keys = Array.from(this.adapters.keys()).sort();
    return keys.map(key => {
      const adapter = this.adapters.get(key)!;
      return {
        name: adapter.name,
        version: adapter.version,
        capabilities: adapter.capabilities(),
        determinismProfile: adapter.determinismProfile(),
        securityProfile: adapter.securityProfile()
      };
    });
  }

  public validateIntegrationCapabilities(name: string, requiredCaps: Partial<CapabilitySet>): boolean {
    const adapter = this.getIntegration(name);
    const caps = adapter.capabilities();
    
    if (requiredCaps.canFetch !== undefined && requiredCaps.canFetch && !caps.canFetch) return false;
    if (requiredCaps.canSubmit !== undefined && requiredCaps.canSubmit && !caps.canSubmit) return false;
    if (requiredCaps.canValidate !== undefined && requiredCaps.canValidate && !caps.canValidate) return false;
    
    return true;
  }
}
