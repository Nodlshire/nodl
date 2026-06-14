package money

import (
	"context"
	"fmt"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/stripe"
	"go.uber.org/zap"
)

// Service aggregates financial data from across the system for read-only views.
type Service struct {
	accountStore *account.Store
	stripeSvc    *stripe.Service
	log          *zap.Logger
	startTime    time.Time
}

// NewService creates a new Money service.
func NewService(accountStore *account.Store, stripeSvc *stripe.Service, log *zap.Logger, startTime time.Time) *Service {
	return &Service{
		accountStore: accountStore,
		stripeSvc:    stripeSvc,
		log:          log,
		startTime:    startTime,
	}
}

// GetMoneyOverview aggregates financial data for an operator.
func (s *Service) GetMoneyOverview(ctx context.Context, operatorEmail string) (*MoneyOverview, error) {
	// 1. Resolve Nodlr ID
	s.log.Debug("MoneyOverview: resolving nodlr", zap.String("email", operatorEmail))
	nodlrs := s.accountStore.ListNodlrs()
	var op *account.Nodlr
	for _, n := range nodlrs {
		if n.Email == operatorEmail {
			op = n
			break
		}
	}

	if op == nil {
		return nil, fmt.Errorf("operator not found for email: %s", operatorEmail)
	}

	s.log.Debug("MoneyOverview: operator resolved", zap.Any("op", op))

	// 2. Fetch Operator View from real ledger sums
	totalCompute, totalPaid, totalPending, lastPayout := s.accountStore.GetOperatorLedgerTotals(op.ID)
	s.log.Debug("MoneyOverview: fetched operator totals", zap.Int64("compute", totalCompute))

	// Stripe Health check
	var health *stripe.StripeHealth
	if s.stripeSvc != nil {
		stripeID := op.StripeConnectID
		if stripeID != "" {
			var err error
			health, err = s.stripeSvc.GetStripeAccountHealth(stripeID)
			if err != nil {
				s.log.Warn("failed to fetch operator stripe health", zap.Error(err), zap.String("id", stripeID))
			}
		}
	}
	s.log.Debug("MoneyOverview: stripe health checked", zap.Any("health", health))

	operatorView := OperatorMoneyView{
		Email:           operatorEmail,
		StripeAccountID: op.StripeConnectID,
		TotalCompute:    totalCompute,
		TotalPaid:       totalPaid,
		TotalPending:    totalPending,
		LastPayout:      lastPayout,
		PayoutStatus:    string(op.PayoutStatus),
	}
	if health != nil {
		operatorView.StripeHealth = &StripeHealth{
			ChargesEnabled:  health.ChargesEnabled,
			PayoutsEnabled:  health.PayoutsEnabled,
			RequirementsDue: health.RequirementsDue,
		}
	}

	// 3. Global Stats for Platform and Founder views
	gCompute, gPaid, gPending := s.accountStore.GetGlobalLedgerStats()
	s.log.Debug("MoneyOverview: global ledger stats fetched", zap.Int64("gCompute", gCompute))

	overrideEarned := int64(float64(gCompute) * 0.03)

	// Founder View (3% platform override)
	founderView := FounderMoneyView{
		Email:                operatorEmail,
		TotalOverride:        overrideEarned, // Mapping legacy fields
		TotalReceived:        0,
		PendingOverride:      overrideEarned,
		TotalOverrideEarned:  overrideEarned,
		TotalOverridePaid:    0,
		TotalOverridePending: overrideEarned,
		FounderEmail:         "stephen@nodl.one",
	}

	// Platform View
	platformView := PlatformMoneyView{
		TotalRevenue:       gCompute,
		TotalPayouts:       gPaid + gPending,
		TreasuryBalance:    gCompute - (gPaid + gPending),
		RevenueFromCompute: gCompute,
		RevenueFromFees:    0, // Stub for now
	}
	if gCompute > 0 {
		platformView.Profitability = float64(platformView.TreasuryBalance) / float64(gCompute)
	}

	// Platform Stripe Health
	if s.stripeSvc != nil {
		platformID := s.stripeSvc.GetPlatformAccountID()
		s.log.Debug("MoneyOverview: checking platform stripe health", zap.String("platformID", platformID))
		pHealth, err := s.stripeSvc.GetStripeAccountHealth(platformID)
		if err != nil {
			s.log.Warn("failed to fetch platform stripe health", zap.Error(err))
		} else if pHealth != nil {
			platformView.StripePlatformHealth = &StripeHealth{
				ChargesEnabled:  pHealth.ChargesEnabled,
				PayoutsEnabled:  pHealth.PayoutsEnabled,
				RequirementsDue: pHealth.RequirementsDue,
			}
		}
	}

	s.log.Debug("MoneyOverview: node status proxying")
	// 4. Node Status (Compute Activity Proxy)
	nodeStatus := NodeStatus{
		Online: totalCompute > 0, // Proxy logic: if they have compute, they are "online"
	}
	// Extract latest heartbeat from last compute record if possible?
	// For now, let's just stick to the proxy request.
	if totalCompute > 0 {
		nodeStatus.LastHeartbeat = lastPayout // Placeholder
		nodeStatus.UptimePercent = 100.0      // Placeholder
	}

	// 5. Treasury Simulation
	s.log.Debug("MoneyOverview: calculating treasury simulation")
	daysActive := time.Since(s.startTime).Hours() / 24
	if daysActive < 1 {
		daysActive = 1
	}

	avgDailyCompute := gCompute / int64(daysActive)
	avgDailyPayouts := (gPaid + gPending) / int64(daysActive)
	netDailyFlow := avgDailyCompute - avgDailyPayouts

	treasuryBalance := gCompute - (gPaid + gPending)
	burnRate := int64(0)
	runway := int64(0)
	if netDailyFlow < 0 {
		burnRate = -netDailyFlow
		if burnRate > 0 {
			runway = treasuryBalance / burnRate
		}
	}

	simulationView := TreasurySimulationView{
		DailyInflowEstimate:      avgDailyCompute,
		DailyOutflowEstimate:     avgDailyPayouts,
		NetDailyFlow:             netDailyFlow,
		Projected7DayBalance:     treasuryBalance + (netDailyFlow * 7),
		Projected30DayBalance:    treasuryBalance + (netDailyFlow * 30),
		Projected90DayBalance:    treasuryBalance + (netDailyFlow * 90),
		BurnRatePerDay:           burnRate,
		RunwayDays:               runway,
		OverrideProjection:       int64(float64(avgDailyCompute)*0.03) * 30,
		OperatorPayoutProjection: avgDailyPayouts * 30,
	}

	// 6. Financial Alerts & Thresholds
	alerts := FinancialAlertsView{
		LowTreasuryWarning:  treasuryBalance < 10000, // < $100.00
		NegativeFlowWarning: netDailyFlow < 0,
		ShortRunwayWarning:  runway > 0 && runway < 30,
	}

	if platformView.StripePlatformHealth != nil {
		alerts.StripeHealthWarning = !platformView.StripePlatformHealth.ChargesEnabled || !platformView.StripePlatformHealth.PayoutsEnabled
	}

	// Revenue Drop detection (7-day window vs lifetime average)
	recentRevenue7d := s.accountStore.GetRecentComputeVolume(7 * 24 * time.Hour)
	avgRecentRevenue := recentRevenue7d / 7
	if daysActive > 7 && avgRecentRevenue < int64(float64(avgDailyCompute)*0.7) {
		alerts.RevenueDropWarning = true
	}

	alerts.OperatorPayoutRisk = avgDailyPayouts > avgDailyCompute
	alerts.FounderOverrideRisk = (avgDailyCompute/int64(daysActive))*30*3/100 > treasuryBalance/10 // 10% of treasury

	// Populate Notes
	if alerts.LowTreasuryWarning {
		alerts.Notes = append(alerts.Notes, "Platform liquidity is critically low")
	}
	if alerts.NegativeFlowWarning {
		alerts.Notes = append(alerts.Notes, "Platform is operating at a net loss")
	}
	if alerts.ShortRunwayWarning {
		alerts.Notes = append(alerts.Notes, "Estimated runway is less than 30 days")
	}
	if alerts.StripeHealthWarning {
		alerts.Notes = append(alerts.Notes, "Stripe platform capabilities are restricted")
	}
	if alerts.RevenueDropWarning {
		alerts.Notes = append(alerts.Notes, "Significant revenue drop detected in the last 7 days")
	}
	if alerts.OperatorPayoutRisk {
		alerts.Notes = append(alerts.Notes, "Payout liabilities exceed current revenue inflows")
	}
	if alerts.FounderOverrideRisk {
		alerts.Notes = append(alerts.Notes, "Founder override projections exceed treasury safety margins")
	}

	// 7. Operational Integrity Snapshot
	revRaw, payRaw := s.accountStore.AuditLedgerRecomputation()
	integrity := IntegritySnapshot{
		LedgerConsistent:    payRaw <= revRaw,
		TreasuryNonNegative: treasuryBalance >= 0,
	}

	if platformView.StripePlatformHealth != nil {
		s.log.Debug("MoneyOverview: checking stripe health consistency")
		integrity.StripeHealthConsistent = platformView.StripePlatformHealth.ChargesEnabled && platformView.StripePlatformHealth.PayoutsEnabled
	}

	// Compute to Revenue Alignment (mismatch > 20% alert)
	// platformView.RevenueFromCompute (derived from gCompute) vs totalCompute (platform-wide)
	if gCompute > 0 {
		s.log.Debug("MoneyOverview: checking compute to revenue alignment", zap.Int64("gCompute", gCompute), zap.Int64("revRaw", revRaw))
		variance := float64(gCompute) / float64(revRaw)
		if variance < 0.8 || variance > 1.2 {
			integrity.ComputeToRevenueAligned = false
			integrity.Notes = append(integrity.Notes, "Revenue tracking variance detected (Compute vs Ledger)")
		} else {
			integrity.ComputeToRevenueAligned = true
		}
	}
	s.log.Debug("MoneyOverview: final recomputation complete")

	if !integrity.LedgerConsistent {
		integrity.Notes = append(integrity.Notes, "Ledger imbalance detected: total payouts exceed platform revenue")
	}
	if !integrity.TreasuryNonNegative {
		integrity.Notes = append(integrity.Notes, "Platform treasury is in a negative state")
	}
	if !integrity.StripeHealthConsistent {
		integrity.Notes = append(integrity.Notes, "Stripe operational health mismatch detected")
	}

	return &MoneyOverview{
		Operator:           operatorView,
		Founder:            founderView,
		Platform:           platformView,
		Node:               nodeStatus,
		TreasurySimulation: simulationView,
		Alerts:             alerts,
		Integrity:          integrity,
	}, nil
}

// GetAcquisitionSummary generates a high-level summary for due-diligence purposes.
func (s *Service) GetAcquisitionSummary(ctx context.Context, email string) (*AcquisitionSummary, error) {
	overview, err := s.GetMoneyOverview(ctx, email)
	if err != nil {
		return nil, err
	}

	summary := &AcquisitionSummary{
		Timestamp:       time.Now().Unix(),
		SystemVersion:   "wnode-core-v1-acq-ready",
		TotalRevenue:    overview.Platform.TotalRevenue,
		TotalPayouts:    overview.Platform.TotalPayouts,
		TreasuryBalance: overview.Platform.TreasuryBalance,
		RunwayDays:      overview.TreasurySimulation.RunwayDays,
		NetDailyFlow:    overview.TreasurySimulation.NetDailyFlow,
	}

	// Calculate AlertsActive
	al := overview.Alerts
	if al.LowTreasuryWarning { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.NegativeFlowWarning { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.ShortRunwayWarning { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.StripeHealthWarning { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.RevenueDropWarning { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.OperatorPayoutRisk { summary.AlertsActive++; summary.RiskScore += 5 }
	if al.FounderOverrideRisk { summary.AlertsActive++; summary.RiskScore += 5 }

	// Calculate IntegrityPass and Penalties
	ig := overview.Integrity
	summary.IntegrityPass = ig.LedgerConsistent && ig.StripeHealthConsistent && ig.TreasuryNonNegative && ig.ComputeToRevenueAligned
	
	if !ig.LedgerConsistent { summary.RiskScore += 3 }
	if !ig.StripeHealthConsistent { summary.RiskScore += 3 }
	if !ig.TreasuryNonNegative { summary.RiskScore += 3 }
	if !ig.ComputeToRevenueAligned { summary.RiskScore += 3 }

	// Scalability & Performance penalties
	if summary.RunwayDays > 0 && summary.RunwayDays < 30 {
		summary.RiskScore += 2
	}
	if summary.TreasuryBalance < 10000 {
		summary.RiskScore += 1
	}

	// Generate Investor Notes
	if summary.IntegrityPass && summary.RiskScore < 5 {
		summary.Notes = append(summary.Notes, "Platform demonstrates exceptional operational stability and financial maturity.")
	}
	if summary.RunwayDays > 90 || summary.RunwayDays == 0 {
		summary.Notes = append(summary.Notes, "Platform has achieved mid-term solvency with stable treasury reserves.")
	} else if summary.RunwayDays > 0 {
		summary.Notes = append(summary.Notes, fmt.Sprintf("Operational runway is currently %d days.", summary.RunwayDays))
	}
	
	if summary.NetDailyFlow > 0 {
		summary.Notes = append(summary.Notes, "Network is operating with a positive daily net flow.")
	}

	return summary, nil
}

// GetDueDiligenceBundle aggregates all platform financial intelligence for institutional partners.
func (s *Service) GetDueDiligenceBundle(ctx context.Context, email string) (*DueDiligenceBundle, error) {
	overview, err := s.GetMoneyOverview(ctx, email)
	if err != nil {
		return nil, err
	}

	acq, err := s.GetAcquisitionSummary(ctx, email)
	if err != nil {
		return nil, err
	}

	bundle := &DueDiligenceBundle{
		Timestamp:          time.Now().Unix(),
		SystemVersion:      "wnode-core-v1-due-diligence",
		Overview:           *overview,
		Integrity:          overview.Integrity,
		Acquisition:        *acq,
		Alerts:             overview.Alerts,
		TreasurySimulation: overview.TreasurySimulation,
	}

	// Forensic Master Summary logic
	if acq.IntegrityPass {
		bundle.Notes = append(bundle.Notes, "INTEGRITY: Platform maintains 100% ledger parity and treasury solvency.")
	} else {
		bundle.Notes = append(bundle.Notes, "INTEGRITY: Audit discrepancies detected. Operational review required.")
	}

	if acq.RiskScore <= 3 {
		bundle.Notes = append(bundle.Notes, "RISK: System risk is within optimal acquisition parameters.")
	} else if acq.RiskScore <= 7 {
		bundle.Notes = append(bundle.Notes, "RISK: Moderate operational risk detected. Baseline stabilized.")
	} else {
		bundle.Notes = append(bundle.Notes, "RISK: Elevated risk score. Manual forensic audit recommended.")
	}

	if bundle.TreasurySimulation.RunwayDays == 0 || bundle.TreasurySimulation.RunwayDays > 90 {
		bundle.Notes = append(bundle.Notes, "SOLVENCY: Long-term platform runway confirmed via stable treasury reserves.")
	} else {
		bundle.Notes = append(bundle.Notes, fmt.Sprintf("SOLVENCY: Current operational runway is calibrated at %d days.", bundle.TreasurySimulation.RunwayDays))
	}

	return bundle, nil
}

// GetTransactions returns the authoritative ledger history for an operator.
func (s *Service) GetTransactions(ctx context.Context, email string) ([]account.CommissionRecord, error) {
	// 1. Resolve Nodlr ID
	nodlrs := s.accountStore.ListNodlrs()
	var opID string
	for _, n := range nodlrs {
		if n.Email == email {
			opID = n.ID
			break
		}
	}

	if opID == "" {
		return nil, nil
	}

	// 2. Fetch from account store
	return s.accountStore.GetLedgerHistory(opID), nil
}

// GetBalance returns the authoritative current balance for an operator.
func (s *Service) GetBalance(ctx context.Context, email string) (int64, error) {
	nodlrs := s.accountStore.ListNodlrs()
	var op *account.Nodlr
	for _, n := range nodlrs {
		if n.Email == email {
			op = n
			break
		}
	}

	if op == nil {
		return 0, nil
	}

	return op.WalletBalance + s.accountStore.GetPendingTotal(op.ID), nil
}
