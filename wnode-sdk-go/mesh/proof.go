package mesh

import (
	"crypto/sha256"
	"encoding/hex"
	"sort"
	"strings"
	"time"

	"github.com/wnodeltd/wnode/wnode-sdk-go"
)

type MeshProofAggregator struct{}

func NewMeshProofAggregator() *MeshProofAggregator {
	return &MeshProofAggregator{}
}

func (p *MeshProofAggregator) AggregateProofs(workflowID string, results []WorkflowStepResult, chainID int, blockTag sdk.BlockTag) (*sdk.ProofOfCompute, error) {
	if len(results) == 0 {
		return nil, &sdk.WnodeDeterminismError{
			Code: "PROOF_AGGREGATION_FAILED",
			Context: map[string]any{
				"reason": "No results provided for aggregation",
			},
		}
	}

	// Sort results by stepId to ensure deterministic ordering of the Merkle Tree
	sort.Slice(results, func(i, j int) bool {
		return results[i].StepID < results[j].StepID
	})

	var stepHashes []string

	for _, res := range results {
		if res.WorkflowID != workflowID {
			return nil, &sdk.WnodeDeterminismError{
				Code: "PROOF_AGGREGATION_FAILED",
				Context: map[string]any{
					"reason":   "WorkflowId mismatch in results",
					"expected": workflowID,
					"received": res.WorkflowID,
				},
			}
		}

		if res.LocalProof.Version != "1.0" || len(res.LocalProof.StepHashes) == 0 {
			return nil, &sdk.WnodeDeterminismError{
				Code: "PROOF_AGGREGATION_FAILED",
				Context: map[string]any{
					"reason": "Invalid local proof schema or version",
					"stepId": res.StepID,
				},
			}
		}

		stepHashes = append(stepHashes, res.StepHash)
	}

	merkleRoot := p.computeMerkleRoot(stepHashes)

	return &sdk.ProofOfCompute{
		Version:    "1.0",
		WorkflowID: workflowID,
		StepHashes: stepHashes,
		MerkleRoot: merkleRoot,
		Timestamp:  time.Now().Unix(),
		ChainID:    chainID,
		BlockTag:   blockTag,
	}, nil
}

func (p *MeshProofAggregator) computeMerkleRoot(hashes []string) string {
	payload := strings.Join(hashes, "")
	hash := sha256.Sum256([]byte(payload))
	return "0x" + hex.EncodeToString(hash[:])
}
