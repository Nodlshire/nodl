package sendgrid

import (
	"github.com/wnode/sdk-go/integrations"
)

type SendgridAdapter struct{}

func NewSendgridAdapter() *SendgridAdapter {
	return &SendgridAdapter{}
}

func (a *SendgridAdapter) Name() string { return "sendgrid" }
func (a *SendgridAdapter) Version() string { return "1.0.0" }

func (a *SendgridAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SendgridAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SendgridAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SendgridAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *SendgridAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *SendgridAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
