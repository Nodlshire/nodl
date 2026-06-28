package discord

import (
	"github.com/wnode/sdk-go/integrations"
)

type DiscordAdapter struct{}

func NewDiscordAdapter() *DiscordAdapter {
	return &DiscordAdapter{}
}

func (a *DiscordAdapter) Name() string { return "discord" }
func (a *DiscordAdapter) Version() string { return "1.0.0" }

func (a *DiscordAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DiscordAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DiscordAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *DiscordAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *DiscordAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *DiscordAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
