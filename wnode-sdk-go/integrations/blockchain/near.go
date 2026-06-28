package near

import (
	"github.com/wnode/sdk-go/integrations"
)

type NearAdapter struct{}

func NewNearAdapter() *NearAdapter {
	return &NearAdapter{}
}

func (a *NearAdapter) Name() string { return "near" }
func (a *NearAdapter) Version() string { return "1.0.0" }

func (a *NearAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *NearAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *NearAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *NearAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *NearAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *NearAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
