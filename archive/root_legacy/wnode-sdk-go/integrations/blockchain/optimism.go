package optimism

import (
	"github.com/wnode/sdk-go/integrations"
)

type OptimismAdapter struct{}

func NewOptimismAdapter() *OptimismAdapter {
	return &OptimismAdapter{}
}

func (a *OptimismAdapter) Name() string { return "optimism" }
func (a *OptimismAdapter) Version() string { return "1.0.0" }

func (a *OptimismAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *OptimismAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *OptimismAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *OptimismAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *OptimismAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *OptimismAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
