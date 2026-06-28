package cosmos

import (
	"github.com/wnode/sdk-go/integrations"
)

type CosmosAdapter struct{}

func NewCosmosAdapter() *CosmosAdapter {
	return &CosmosAdapter{}
}

func (a *CosmosAdapter) Name() string { return "cosmos" }
func (a *CosmosAdapter) Version() string { return "1.0.0" }

func (a *CosmosAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CosmosAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CosmosAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CosmosAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *CosmosAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *CosmosAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
