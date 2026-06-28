package avalanche

import (
	"github.com/wnode/sdk-go/integrations"
)

type AvalancheAdapter struct{}

func NewAvalancheAdapter() *AvalancheAdapter {
	return &AvalancheAdapter{}
}

func (a *AvalancheAdapter) Name() string { return "avalanche" }
func (a *AvalancheAdapter) Version() string { return "1.0.0" }

func (a *AvalancheAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AvalancheAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AvalancheAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AvalancheAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *AvalancheAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *AvalancheAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
