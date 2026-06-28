package square

import (
	"github.com/wnode/sdk-go/integrations"
)

type SquareAdapter struct{}

func NewSquareAdapter() *SquareAdapter {
	return &SquareAdapter{}
}

func (a *SquareAdapter) Name() string { return "square" }
func (a *SquareAdapter) Version() string { return "1.0.0" }

func (a *SquareAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SquareAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SquareAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SquareAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *SquareAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *SquareAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
