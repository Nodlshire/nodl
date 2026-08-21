package sui

import (
	"github.com/wnode/sdk-go/integrations"
)

type SuiAdapter struct{}

func NewSuiAdapter() *SuiAdapter {
	return &SuiAdapter{}
}

func (a *SuiAdapter) Name() string { return "sui" }
func (a *SuiAdapter) Version() string { return "1.0.0" }

func (a *SuiAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SuiAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SuiAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SuiAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *SuiAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *SuiAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
