package sia

import (
	"github.com/wnode/sdk-go/integrations"
)

type SiaAdapter struct{}

func NewSiaAdapter() *SiaAdapter {
	return &SiaAdapter{}
}

func (a *SiaAdapter) Name() string { return "sia" }
func (a *SiaAdapter) Version() string { return "1.0.0" }

func (a *SiaAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SiaAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SiaAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SiaAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *SiaAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *SiaAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
