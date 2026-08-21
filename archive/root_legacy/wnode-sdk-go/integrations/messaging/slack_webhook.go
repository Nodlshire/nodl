package slack_webhook

import (
	"github.com/wnode/sdk-go/integrations"
)

type Slack_webhookAdapter struct{}

func NewSlack_webhookAdapter() *Slack_webhookAdapter {
	return &Slack_webhookAdapter{}
}

func (a *Slack_webhookAdapter) Name() string { return "slack_webhook" }
func (a *Slack_webhookAdapter) Version() string { return "1.0.0" }

func (a *Slack_webhookAdapter) Fetch(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Slack_webhookAdapter) Submit(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Slack_webhookAdapter) Validate(params interface{}) integrations.IntegrationResult {
	return integrations.IntegrationResult{PayloadHash: "mock", IntegrityProof: "mock"}
}

func (a *Slack_webhookAdapter) Capabilities() integrations.CapabilitySet {
	return integrations.CapabilitySet{CanFetch: true, CanSubmit: true, CanValidate: true}
}

func (a *Slack_webhookAdapter) DeterminismProfile() integrations.DeterminismProfile {
	return integrations.DeterminismProfile{IsPurelyDeterministic: true}
}

func (a *Slack_webhookAdapter) SecurityProfile() integrations.SecurityProfile {
	return integrations.SecurityProfile{}
}
