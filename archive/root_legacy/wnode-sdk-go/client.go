package sdk

import (
	"time"
)

// WnodeClient is the core client for interacting with the Sovereign Mesh deterministically.
type WnodeClient struct {
	Config          WnodeClientConfig
	rpcAdapter      *DeterministicRPCAdapter
	workflowAdapter *WorkflowEngineAdapter
	auditAdapter    *AuditPipelineAdapter
	validator       *RuntimeValidator
}

// NewWnodeClient initializes a new WnodeClient.
func NewWnodeClient(config WnodeClientConfig) *WnodeClient {
	return &WnodeClient{
		Config:          config,
		rpcAdapter:      NewDeterministicRPCAdapter(config),
		workflowAdapter: NewWorkflowEngineAdapter(config),
		auditAdapter:    NewAuditPipelineAdapter(config),
		validator:       NewRuntimeValidator(config),
	}
}

// ReadContract performs a deterministic read against the target chain via Wnode’s execution layer.
// Rejects unsafe blockTags in StrictDeterminism mode.
func (c *WnodeClient) ReadContract(params ReadContractParams) (interface{}, error) {
	if err := c.validator.ValidateReadContract(params); err != nil {
		return nil, err
	}
	response, err := c.rpcAdapter.ReadContract(params)
	if err != nil {
		return nil, err
	}
	return response.Result, nil
}

// BuildCalldata encodes a function call into calldata. No network calls required.
func (c *WnodeClient) BuildCalldata(params BuildCalldataParams) (CalldataResult, error) {
	// Stub implementation
	return CalldataResult{
		To:         params.Address,
		Data:       "0x", // Mock encoded data
		ChainID:    c.Config.ChainID,
		SDKVersion: c.Config.SDKVersion,
	}, nil
}

// ExecuteWorkflow executes a deterministic multi-step workflow defined in Wnode (JSON spec).
func (c *WnodeClient) ExecuteWorkflow(params ExecuteWorkflowParams) (ExecuteWorkflowResult, error) {
	if err := c.validator.ValidateWorkflowExecution(params); err != nil {
		return ExecuteWorkflowResult{}, err
	}
	result, err := c.workflowAdapter.ExecuteWorkflow(params)
	if err != nil {
		return result, err
	}
	if err := c.validator.ValidateProofOfCompute(result.Proof); err != nil {
		return result, err
	}
	return result, nil
}

// AuditLog sends audit events to Wnode’s audit pipeline. Fire-and-forget.
func (c *WnodeClient) AuditLog(entry AuditEntry) error {
	entry.ChainID = c.Config.ChainID
	entry.SDKVersion = c.Config.SDKVersion
	if entry.Timestamp == 0 {
		entry.Timestamp = time.Now().Unix()
	}
	_ = c.validator.ValidateProofOfCompute(entry.Proof)
	c.auditAdapter.AuditLog(entry)
	return nil
}
