package arbitrum

import (
	"github.com/wnode/sdk-go/integrations"
)

type ArbitrumAdapter struct{}

func NewArbitrumAdapter() *ArbitrumAdapter {
	return &ArbitrumAdapter{}
}

func (a *ArbitrumAdapter) Name() string { return "arbitrum" }
func (a *ArbitrumAdapter) Version() string { return "1.0.0" }

func (a *ArbitrumAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *ArbitrumAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *ArbitrumAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *ArbitrumAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *ArbitrumAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *ArbitrumAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
