package sdk

type RuntimeValidator struct {
	config WnodeClientConfig
}

func NewRuntimeValidator(config WnodeClientConfig) *RuntimeValidator {
	return &RuntimeValidator{
		config: config,
	}
}

func (v *RuntimeValidator) ValidateReadContract(params ReadContractParams) error {
	if v.config.StrictDeterminism {
		if !params.BlockTag.Finalized && params.BlockTag.BlockHash == "" {
			return NewWnodeDeterminismError("RUNTIME_VALIDATION_FAILED", map[string]interface{}{
				"reason":   "Strict mode requires finalized or blockHash blockTags.",
				"blockTag": params.BlockTag,
				"chainId":  v.config.ChainID,
			}, nil)
		}
	}
	return nil
}

func (v *RuntimeValidator) ValidateWorkflowExecution(params ExecuteWorkflowParams) error {
	if params.Workflow == "" {
		return NewWnodeDeterminismError("RUNTIME_VALIDATION_FAILED", map[string]interface{}{
			"reason":  "Workflow ID is required for execution.",
			"chainId": v.config.ChainID,
		}, nil)
	}
	return nil
}

func (v *RuntimeValidator) ValidateProofOfCompute(proof *ProofOfCompute) error {
	if proof == nil {
		return nil
	}

	if proof.Version != "1.0" {
		return NewWnodeDeterminismError("RUNTIME_VALIDATION_FAILED", map[string]interface{}{
			"reason":  "Unsupported Proof of Compute version.",
			"version": proof.Version,
			"chainId": v.config.ChainID,
		}, nil)
	}

	if len(proof.StepHashes) == 0 {
		return NewWnodeDeterminismError("RUNTIME_VALIDATION_FAILED", map[string]interface{}{
			"reason":  "Proof of Compute must contain step hashes.",
			"chainId": v.config.ChainID,
		}, nil)
	}

	return nil
}
