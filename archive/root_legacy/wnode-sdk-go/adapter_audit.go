package sdk

import (
	"encoding/json"
	"fmt"
	"os"
)

type AuditPipelineAdapter struct {
	config WnodeClientConfig
}

func NewAuditPipelineAdapter(config WnodeClientConfig) *AuditPipelineAdapter {
	return &AuditPipelineAdapter{
		config: config,
	}
}

func (a *AuditPipelineAdapter) AuditLog(entry AuditEntry) {
	if entry.ChainID == 0 || entry.SDKVersion == "" || entry.Timestamp == 0 {
		fmt.Println("[Wnode Audit Pipeline] Failed: AuditEntry missing mandated metadata")
		return
	}

	payload, err := json.Marshal(entry)
	if err != nil {
		fmt.Println("[Wnode Audit Pipeline] Failed to serialize audit log:", err)
		return
	}

	// Write to wnode-audit.jsonl securely
	f, err := os.OpenFile("wnode-audit.jsonl", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err == nil {
		defer f.Close()
		_, _ = f.WriteString(string(payload) + "\n")
	}

	// Simulate non-blocking fire and forget log
	fmt.Printf("[Wnode Audit Pipeline] Serialized log event: %s\n", string(payload))
}
