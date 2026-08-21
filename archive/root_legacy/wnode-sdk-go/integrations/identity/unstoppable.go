package unstoppable

import (
	"github.com/wnode/sdk-go/integrations"
)

type UnstoppableAdapter struct{}

func NewUnstoppableAdapter() *UnstoppableAdapter {
	return &UnstoppableAdapter{}
}

func (a *UnstoppableAdapter) Name() string { return "unstoppable" }
func (a *UnstoppableAdapter) Version() string { return "1.0.0" }

func (a *UnstoppableAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *UnstoppableAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *UnstoppableAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *UnstoppableAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *UnstoppableAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *UnstoppableAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
