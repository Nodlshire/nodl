package sdk

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"
)

type WorkflowEngineAdapter struct {
	config WnodeClientConfig
}

func NewWorkflowEngineAdapter(config WnodeClientConfig) *WorkflowEngineAdapter {
	return &WorkflowEngineAdapter{
		config: config,
	}
}

func (a *WorkflowEngineAdapter) ExecuteWorkflow(params ExecuteWorkflowParams) (ExecuteWorkflowResult, error) {
	if params.Workflow == "" {
		return ExecuteWorkflowResult{}, NewWnodeWorkflowError("WORKFLOW_EXECUTION_FAILED", map[string]interface{}{
			"error":      "Workflow ID missing",
			"chainId":    a.config.ChainID,
			"timestamp":  time.Now().Unix(),
			"sdkVersion": a.config.SDKVersion,
		}, nil)
	}

	blockTag := BlockTag{Finalized: true}
	if !a.config.StrictDeterminism {
		blockTag = BlockTag{BlockNumber: 0}
	}

	stepInputBytes, _ := json.Marshal(params.Params)
	stepOutputBytes, _ := json.Marshal(map[string]interface{}{"success": true, "mocked": true})
	blockTagBytes, _ := json.Marshal(blockTag)

	payloadToHash := append(stepInputBytes, stepOutputBytes...)
	payloadToHash = append(payloadToHash, blockTagBytes...)

	hash := sha256.Sum256(payloadToHash)
	stepHashStr := fmt.Sprintf("0x%x", hash)

	proof := &ProofOfCompute{
		Version:    "1.0",
		WorkflowID: params.Workflow,
		StepHashes: []string{stepHashStr},
		MerkleRoot: stepHashStr,
		Timestamp:  time.Now().Unix(),
		ChainID:    a.config.ChainID,
		BlockTag:   blockTag,
	}

	var parsedResult interface{}
	json.Unmarshal(stepOutputBytes, &parsedResult)

	return ExecuteWorkflowResult{
		Result: parsedResult,
		Proof:  proof,
		Logs:   []interface{}{"Workflow started", "Step 1 completed"},
	}, nil
}
