package circle

import (
	"github.com/wnode/sdk-go/integrations"
)

type CircleAdapter struct{}

func NewCircleAdapter() *CircleAdapter {
	return &CircleAdapter{}
}

func (a *CircleAdapter) Name() string { return "circle" }
func (a *CircleAdapter) Version() string { return "1.0.0" }

func (a *CircleAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CircleAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CircleAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *CircleAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *CircleAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *CircleAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
