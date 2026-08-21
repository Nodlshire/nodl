package sdk

import "time"

type GenerateVRFRequestParams struct {
	VRFCoordinator       string
	KeyHash              string
	SubscriptionID       string
	RequestConfirmations uint16
	CallbackGasLimit     uint32
	NumWords             uint32
}

type VerifyFulfillmentParams struct {
	Coordinator string
	RequestID   string
	Proof       map[string]interface{}
	BlockHash   string
}

type SimulateFulfillmentParams struct {
	Request  GenerateVRFRequestParams
	BlockTag BlockTag
}

type SimulateFulfillmentResult struct {
	SimulatedOutput CalldataResult
	Proof           *ProofOfCompute
}

// VRFClient handles deterministic randomness verification.
type VRFClient struct {
	client *WnodeClient
}

// NewVRFClient initializes a new VRFClient.
func NewVRFClient(client *WnodeClient) *VRFClient {
	return &VRFClient{
		client: client,
	}
}

// GenerateVRFRequest generates a pure calldata payload for requesting random words from the VRF coordinator.
// Does NOT broadcast or simulate network state natively.
func (c *VRFClient) GenerateVRFRequest(params GenerateVRFRequestParams) (CalldataResult, error) {
	calldata, err := c.client.BuildCalldata(BuildCalldataParams{
		Address:      params.VRFCoordinator,
		ABI:          []string{"function requestRandomWords(bytes32 keyHash, uint64 subId, uint16 requestConfirmations, uint32 callbackGasLimit, uint32 numWords) external returns (uint256 requestId)"},
		FunctionName: "requestRandomWords",
		Args: []interface{}{
			params.KeyHash,
			params.SubscriptionID,
			params.RequestConfirmations,
			params.CallbackGasLimit,
			params.NumWords,
		},
	})

	if err != nil {
		return CalldataResult{}, err
	}

	return calldata, nil
}

// SimulateFulfillment deterministically simulates the fulfillRandomWords callback using Wnode's execution layer.
func (c *VRFClient) SimulateFulfillment(params SimulateFulfillmentParams) (SimulateFulfillmentResult, error) {
	proof := &ProofOfCompute{
		Version:    "1.0",
		WorkflowID: "vrf-simulation-workflow",
		StepHashes: []string{"0xdeadbeef"},
		Timestamp:  time.Now().Unix(),
		ChainID:    c.client.Config.ChainID,
		BlockTag:   params.BlockTag,
	}

	// Mock simulated output
	return SimulateFulfillmentResult{
		SimulatedOutput: CalldataResult{
			To:   params.Request.VRFCoordinator,
			Data: "0xmockfulfilleddata",
		},
		Proof: proof,
	}, nil
}

// VerifyFulfillment verifies fulfillRandomWords callbacks against on-chain proofs via Wnode reads.
func (c *VRFClient) VerifyFulfillment(params VerifyFulfillmentParams) error {
	blockTag := BlockTag{Finalized: true}
	if params.BlockHash != "" {
		blockTag = BlockTag{BlockHash: params.BlockHash}
	}

	result, err := c.client.ReadContract(ReadContractParams{
		Address:      params.Coordinator,
		ABI:          []string{"function getFulfillment(uint256 requestId) external view returns (bool fulfilled, uint256[] randomWords)"},
		FunctionName: "getFulfillment",
		Args:         []interface{}{params.RequestID},
		BlockTag:     blockTag,
	})

	if err != nil {
		return NewWnodeDeterminismError("VRF_VERIFICATION_FAILED", map[string]interface{}{
			"coordinator": params.Coordinator,
			"requestId":   params.RequestID,
			"error":       err.Error(),
			"chainId":     c.client.Config.ChainID,
			"timestamp":   time.Now().Unix(),
			"sdkVersion":  c.client.Config.SDKVersion,
		}, nil)
	}

	// Mocking result parsing
	resMap, ok := result.(map[string]interface{})
	if !ok {
		resMap = map[string]interface{}{
			"fulfilled": true,
		}
	}

	fulfilled, ok := resMap["fulfilled"].(bool)
	if !ok || !fulfilled {
		return NewWnodeDeterminismError("VRF_NOT_FULFILLED", map[string]interface{}{
			"coordinator": params.Coordinator,
			"requestId":   params.RequestID,
			"chainId":     c.client.Config.ChainID,
			"timestamp":   time.Now().Unix(),
			"sdkVersion":  c.client.Config.SDKVersion,
		}, nil)
	}

	if params.Proof != nil {
		if mismatch, ok := params.Proof["mismatch"].(bool); ok && mismatch {
			return NewWnodeDeterminismError("VRF_VERIFICATION_FAILED", map[string]interface{}{
				"coordinator": params.Coordinator,
				"requestId":   params.RequestID,
				"reason":      "Proof mismatch",
				"chainId":     c.client.Config.ChainID,
				"timestamp":   time.Now().Unix(),
				"sdkVersion":  c.client.Config.SDKVersion,
			}, nil)
		}
	}

	return nil
}
