package sdk

import (
	"log"
	"time"
)

type DeterministicRPCResponse struct {
	Result   interface{}
	Metadata map[string]interface{}
}

type DeterministicRPCAdapter struct {
	config WnodeClientConfig
}

func NewDeterministicRPCAdapter(config WnodeClientConfig) *DeterministicRPCAdapter {
	return &DeterministicRPCAdapter{
		config: config,
	}
}

func (a *DeterministicRPCAdapter) ReadContract(params ReadContractParams) (DeterministicRPCResponse, error) {
	if a.config.StrictDeterminism {
		if !params.BlockTag.Finalized && params.BlockTag.BlockHash == "" {
			return DeterministicRPCResponse{}, NewWnodeDeterminismError("UNSAFE_BLOCKTAG", map[string]interface{}{
				"blockTag":   params.BlockTag,
				"chainId":    a.config.ChainID,
				"timestamp":  time.Now().Unix(),
				"sdkVersion": a.config.SDKVersion,
			}, nil)
		}
	} else {
		if params.BlockTag.BlockNumber > 0 {
			log.Println("[Wnode WARNING] Unsafe blockTag used — determinism may degrade.")
		}
	}

	// Simulate successful RPC response
	return DeterministicRPCResponse{
		Result: nil, // Mock result
		Metadata: map[string]interface{}{
			"chainId":      a.config.ChainID,
			"timestamp":    time.Now().Unix(),
			"sdkVersion":   a.config.SDKVersion,
			"blockTagUsed": params.BlockTag,
		},
	}, nil
}
