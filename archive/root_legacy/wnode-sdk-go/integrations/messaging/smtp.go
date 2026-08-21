package smtp

import (
	"github.com/wnode/sdk-go/integrations"
)

type SmtpAdapter struct{}

func NewSmtpAdapter() *SmtpAdapter {
	return &SmtpAdapter{}
}

func (a *SmtpAdapter) Name() string { return "smtp" }
func (a *SmtpAdapter) Version() string { return "1.0.0" }

func (a *SmtpAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SmtpAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SmtpAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *SmtpAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *SmtpAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *SmtpAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
