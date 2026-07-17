package governance

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"github.com/obregan/nodl/nodld/internal/ai"
)

// ConsensusProposer interface allows the approval flow to push approved AI suggestions into consensus
type ConsensusProposer interface {
	ProposeGlobalGovernanceUpdate(ctx context.Context, key string, payload []byte) error
}

type ApprovalFlow struct {
	pipeline *ai.RecommendationPipeline
	ctrl     ConsensusProposer
	log      *zap.Logger
}

func NewApprovalFlow(pipeline *ai.RecommendationPipeline, ctrl ConsensusProposer, logger *zap.Logger) *ApprovalFlow {
	return &ApprovalFlow{
		pipeline: pipeline,
		ctrl:     ctrl,
		log:      logger,
	}
}

// ApproveRecommendation human-in-the-loop explicit approval hook
func (a *ApprovalFlow) ApproveRecommendation(ctx context.Context, id string) error {
	pending := a.pipeline.GetPendingRecommendations()
	var rec *ai.Recommendation

	for _, p := range pending {
		if p.ID == id {
			rec = &p
			break
		}
	}

	if rec == nil {
		return fmt.Errorf("recommendation %s not found or not pending", id)
	}

	a.log.Info("ApprovalFlow: Human approved AI recommendation", zap.String("id", id))

	// Push the approved change into the global consensus stream
	// Note: AI never mutates state directly. It simply formats a proposal that a human approves,
	// and the approval triggers the identical deterministic Raft apply flow used natively.
	err := a.ctrl.ProposeGlobalGovernanceUpdate(ctx, rec.Type, []byte(rec.SuggestedValue))
	if err != nil {
		return err
	}

	// Update the advisory log status
	a.pipeline.UpdateRecommendationStatus(id, "approved")
	return nil
}

// RejectRecommendation human-in-the-loop explicit rejection hook
func (a *ApprovalFlow) RejectRecommendation(ctx context.Context, id string) error {
	if a.pipeline.UpdateRecommendationStatus(id, "rejected") {
		a.log.Info("ApprovalFlow: Human rejected AI recommendation", zap.String("id", id))
		return nil
	}
	return fmt.Errorf("recommendation %s not found", id)
}
