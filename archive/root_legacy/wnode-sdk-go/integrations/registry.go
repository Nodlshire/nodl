package integrations

import (
	"errors"
	"sort"
)

type IntegrationMetadata struct {
	Name               string             `json:"name"`
	Version            string             `json:"version"`
	Capabilities       CapabilitySet      `json:"capabilities"`
	DeterminismProfile DeterminismProfile `json:"determinismProfile"`
	SecurityProfile    SecurityProfile    `json:"securityProfile"`
}

type IntegrationRegistry struct {
	adapters map[string]IntegrationAdapter
}

func NewIntegrationRegistry() *IntegrationRegistry {
	return &IntegrationRegistry{
		adapters: make(map[string]IntegrationAdapter),
	}
}

func (r *IntegrationRegistry) RegisterIntegration(adapter IntegrationAdapter) error {
	name := adapter.Name()
	if _, exists := r.adapters[name]; exists {
		return errors.New("integration already registered")
	}

	profile := adapter.DeterminismProfile()
	if !profile.IsPurelyDeterministic && profile.ReliesOnRandomness {
		return errors.New("integration violates strict determinism invariants")
	}

	r.adapters[name] = adapter
	return nil
}

func (r *IntegrationRegistry) GetIntegration(name string) (IntegrationAdapter, error) {
	adapter, exists := r.adapters[name]
	if !exists {
		return nil, errors.New("integration not found")
	}
	return adapter, nil
}

func (r *IntegrationRegistry) ListIntegrations() []IntegrationMetadata {
	keys := make([]string, 0, len(r.adapters))
	for k := range r.adapters {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	list := make([]IntegrationMetadata, len(keys))
	for i, k := range keys {
		adapter := r.adapters[k]
		list[i] = IntegrationMetadata{
			Name:               adapter.Name(),
			Version:            adapter.Version(),
			Capabilities:       adapter.Capabilities(),
			DeterminismProfile: adapter.DeterminismProfile(),
			SecurityProfile:    adapter.SecurityProfile(),
		}
	}
	return list
}
