package github

import (
	"github.com/wnode/sdk-go/integrations"
)

type GithubAdapter struct{}

func NewGithubAdapter() *GithubAdapter {
	return &GithubAdapter{}
}

func (a *GithubAdapter) Name() string { return "github" }
func (a *GithubAdapter) Version() string { return "1.0.0" }

func (a *GithubAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GithubAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GithubAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *GithubAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *GithubAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *GithubAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
