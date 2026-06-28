package api3

import (
	"github.com/wnode/sdk-go/integrations"
)

type Api3Adapter struct{}

func NewApi3Adapter() *Api3Adapter {
	return &Api3Adapter{}
}

func (a *Api3Adapter) Name() string { return "api3" }
func (a *Api3Adapter) Version() string { return "1.0.0" }

func (a *Api3Adapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Api3Adapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Api3Adapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Api3Adapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *Api3Adapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *Api3Adapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
