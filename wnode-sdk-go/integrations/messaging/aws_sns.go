package aws_sns

import (
	"github.com/wnode/sdk-go/integrations"
)

type Aws_snsAdapter struct{}

func NewAws_snsAdapter() *Aws_snsAdapter {
	return &Aws_snsAdapter{}
}

func (a *Aws_snsAdapter) Name() string { return "aws_sns" }
func (a *Aws_snsAdapter) Version() string { return "1.0.0" }

func (a *Aws_snsAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Aws_snsAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Aws_snsAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Aws_snsAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *Aws_snsAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *Aws_snsAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
