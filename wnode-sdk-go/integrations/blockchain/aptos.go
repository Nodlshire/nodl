package aptos

import (
	"github.com/wnode/sdk-go/integrations"
)

type AptosAdapter struct{}

func NewAptosAdapter() *AptosAdapter {
	return &AptosAdapter{}
}

func (a *AptosAdapter) Name() string { return "aptos" }
func (a *AptosAdapter) Version() string { return "1.0.0" }

func (a *AptosAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AptosAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AptosAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *AptosAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *AptosAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *AptosAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
