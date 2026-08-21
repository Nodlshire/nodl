package gitcoin_passport

import (
	"github.com/wnode/sdk-go/integrations"
)

type Gitcoin_passportAdapter struct{}

func NewGitcoin_passportAdapter() *Gitcoin_passportAdapter {
	return &Gitcoin_passportAdapter{}
}

func (a *Gitcoin_passportAdapter) Name() string { return "gitcoin_passport" }
func (a *Gitcoin_passportAdapter) Version() string { return "1.0.0" }

func (a *Gitcoin_passportAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Gitcoin_passportAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Gitcoin_passportAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Gitcoin_passportAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *Gitcoin_passportAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *Gitcoin_passportAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
