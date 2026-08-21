package pusher

import (
	"github.com/wnode/sdk-go/integrations"
)

type PusherAdapter struct{}

func NewPusherAdapter() *PusherAdapter {
	return &PusherAdapter{}
}

func (a *PusherAdapter) Name() string { return "pusher" }
func (a *PusherAdapter) Version() string { return "1.0.0" }

func (a *PusherAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PusherAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PusherAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *PusherAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *PusherAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *PusherAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
