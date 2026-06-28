package cardano

import (
	"github.com/wnode/sdk-go/integrations"
)

type CardanoAdapter struct{}

func NewCardanoAdapter() *CardanoAdapter {
	return &CardanoAdapter{}
}

func (a *CardanoAdapter) Name() string { return "cardano" }
func (a *CardanoAdapter) Version() string { return "1.0.0" }

func (a *CardanoAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CardanoAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CardanoAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CardanoAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *CardanoAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *CardanoAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
