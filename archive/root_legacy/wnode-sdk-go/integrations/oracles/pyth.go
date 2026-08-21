package pyth

import (
	"github.com/wnode/sdk-go/integrations"
)

type PythAdapter struct{}

func NewPythAdapter() *PythAdapter {
	return &PythAdapter{}
}

func (a *PythAdapter) Name() string { return "pyth" }
func (a *PythAdapter) Version() string { return "1.0.0" }

func (a *PythAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PythAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PythAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PythAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *PythAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *PythAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
