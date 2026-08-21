package account

import (
	"context"
	"fmt"
	"time"

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

		pending := n.PendingBalanceCents
		if pending <= 0 {
			continue
		}

		// ── CONSTITUTIONAL FREEZE GUARD ─────────────────────────────────────
		// If account is frozen, block payouts UNLESS it has been > 120 days.
		if n.IsFrozen {
			releaseTime := n.FrozenAt.Add(FreezeMinimumPayoutDays * 24 * time.Hour)
			if now.Before(releaseTime) {
				s.log.Warn("payout guard: holding funds due to active freeze status", 
					zap.String("nodlr", n.ID), zap.Time("releaseAt", releaseTime))
				continue
			}
			s.log.Info("payout guard: 120-day compliance period expired, releasing funds automatically", 
				zap.String("nodlr", n.ID))
		}

		// ── Integrity Guard (Legacy) ─────────────────────────────────────────
		if n.IntegrityScore <= 500 {
			s.log.Warn("payout guard: holding funds due to low integrity score", 
				zap.String("nodlr", n.ID), zap.Int("score", n.IntegrityScore))
			continue
		}

		// ── Authoritative Settlement Execution ──────────────────────────────
		records := s.store.GetPendingRecords(n.ID)

		payouts := make(map[string]int64)
		var platformAmt int64

		for _, r := range records {
			if r.Status != "pending" {
				continue
			}
			if r.Role == CommRoleWnode {
				platformAmt += r.AmountCents
			} else {
				payouts[r.RecipientID] += r.AmountCents
			}
		}

		jobID := fmt.Sprintf("FUSION_%s_%d", n.ID[:8], now.Unix())
		// transferGroup is used by Stripe to group these payouts
		transferGroup := fmt.Sprintf("GRP_%s", jobID) 

		// ── Execution via Stripe Service ────────────────────────────────────
		err := s.stripe.ProcessCommissionPayouts(jobID, platformAmt, payouts, transferGroup)
		if err == nil {
			s.store.FinalizePayout(n.ID)
			s.log.Info("settlement successful", zap.String("id", n.ID), zap.Int64("total", pending))
		} else {
			s.log.Error("settlement failed", zap.String("id", n.ID), zap.Error(err))
		}
	}
}
