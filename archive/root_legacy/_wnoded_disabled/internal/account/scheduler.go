package account

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/p2p"
	"go.uber.org/zap"
)

// StripePayer is an interface for the Stripe service method we need.
type StripePayer interface {
	ProcessCommissionPayouts(jobID string, platformAmt int64, payouts map[string]int64, transferGroup string) error
}

type Scheduler struct {
	store    *Store
	stripe   StripePayer
	log      *zap.Logger
}

func NewScheduler(store *Store, stripe StripePayer, log *zap.Logger) *Scheduler {
	return &Scheduler{
		store:  store,
		stripe: stripe,
		log:    log,
	}
}

func (s *Scheduler) Run(ctx context.Context) {
	s.log.Info("affiliate settlement scheduler starting")
	
	// Check every hour for due payouts
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			s.Settle()
		}
	}
}

func (s *Scheduler) Settle() {
	s.log.Debug("starting settlement cycle")
	
	nodlrs := s.store.ListNodlrs()
	now := time.Now()

	for _, n := range nodlrs {
		if n.StripeConnectID == "" || n.PayoutStatus != PayoutStatusActive {
			continue
		}

		pending := s.store.GetPendingTotal(n.ID)
		if pending <= 0 {
			continue
		}

		// ── Automated Payout Guard ───────────────────────────────────────────
		if n.IntegrityScore <= 500 {
			s.log.Warn("payout guard: holding funds due to low integrity score", 
				zap.String("nodlr", n.ID), zap.Int("score", n.IntegrityScore))
			continue
		}

		// ── Waterfall Engine ─────────────────────────────────────────────────
		split := p2p.CalculateWaterfall(pending)
		jobID := fmt.Sprintf("FUSION_%s_%d", n.ID[:8], now.Unix())
		transferGroup := p2p.GetTransferGroup(jobID)

		payouts := make(map[string]int64)

		// 1. Worker (84%)
		payouts[n.StripeConnectID] = split.WorkerCents

		// 2. Affiliates (L1: 2%, L2: 6%)
		l1ID, l2ID := s.store.ResolveTree(n.ID)
		if l1, ok := s.store.GetNodlr(l1ID); ok && l1.StripeConnectID != "" {
			payouts[l1.StripeConnectID] = split.L1Cents
		}
		if l2, ok := s.store.GetNodlr(l2ID); ok && l2.StripeConnectID != "" {
			payouts[l2.StripeConnectID] = split.L2Cents
		}

		// 3. Founder Override (3%)
		founderID := s.store.GetGenesisFounder(n.ID)
		if founderID != "" {
			founder, ok := s.store.GetNodlr(founderID)
			if ok {
				// 4. Empty Founder Logic
				if founder.Email == "system@wnode.ltd" {
					founder.AccruedFounderBalance += split.FounderCents
					s.log.Info("accruing founder balance (unassigned slot)", 
						zap.String("founderID", founderID), zap.Int64("amt", split.FounderCents))
				} else if founder.StripeConnectID != "" {
					payouts[founder.StripeConnectID] += split.FounderCents
				}
			}
		}
		
		// 5. Execution
		err := s.stripe.ProcessCommissionPayouts(jobID, split.PlatformCents, payouts, transferGroup)
		if err == nil {
			s.store.ClearPending(n.ID)
		} else {
			s.log.Error("fusion settlement failed", zap.String("id", n.ID), zap.Error(err))
		}
	}
}
