package twilio

import (
	"github.com/wnode/sdk-go/integrations"
)

type TwilioAdapter struct{}

func NewTwilioAdapter() *TwilioAdapter {
	return &TwilioAdapter{}
}

func (a *TwilioAdapter) Name() string { return "twilio" }
func (a *TwilioAdapter) Version() string { return "1.0.0" }

func (a *TwilioAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwilioAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwilioAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *TwilioAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *TwilioAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *TwilioAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
