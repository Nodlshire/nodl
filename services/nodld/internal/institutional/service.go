package institutional

import (
	"context"
	"sort"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

// Service provides high-level governance and institutional metrics.
type Service struct {
	accountStore *account.Store
	forensics    *forensics.Store
	log          *zap.Logger
}

func NewService(accountStore *account.Store, forensics *forensics.Store, log *zap.Logger) *Service {
	return &Service{
		accountStore: accountStore,
		forensics:    forensics,
		log:          log,
	}
}

// GetOverview aggregates global platform health.
func (s *Service) GetOverview(ctx context.Context) (*InstitutionalOverview, error) {
	totalRev, totalPaid, totalPending := s.accountStore.GetGlobalLedgerStats()
	nodlrs := s.accountStore.ListNodlrs()

	activeNodes := 0
	for _, n := range nodlrs {
		if s.accountStore.GetPendingTotal(n.ID) > 0 {
			activeNodes++
		}
	}

	treasury := totalRev - totalPaid - totalPending
	margin := 0.0
	if totalRev > 0 {
		margin = float64(treasury) / float64(totalRev)
	}

	return &InstitutionalOverview{
		Timestamp:            time.Now(),
		TotalRevenueCents:    totalRev,
		TotalPayoutsCents:    totalPaid + totalPending,
		TreasuryBalanceCents: treasury,
		ActiveNodeCount:      activeNodes,
		TotalOperatorCount:   len(nodlrs),
		NetworkIntegrity:     1.0, 
		PlatformProfitMargin: margin,
	}, nil
}

// GetRunRate calculates financial projections based on historical volume.
func (s *Service) GetRunRate(ctx context.Context, days int) (*RunRateAggregate, error) {
	window := time.Duration(days) * 24 * time.Hour
	totalVolume := s.accountStore.GetRecentComputeVolume(window)
	
	// Derive projections
	dailyAvg := totalVolume / int64(days)
	yearlyProj := dailyAvg * 365

	// Approximate splits for the segment based on economics model
	// In a forensic system, we iterate the ledger. For overview, we scale.
	return &RunRateAggregate{
		PeriodDays:         days,
		TotalVolumeCents:   totalVolume,
		OperatorShareCents: int64(float64(totalVolume) * 0.80),
		PlatformShareCents: int64(float64(totalVolume) * 0.07),
		FounderShareCents:  int64(float64(totalVolume) * 0.03),
		DailyAverageCents:  dailyAvg,
		ProjectedYearly:    yearlyProj,
	}, nil
}

// GetOperatorPerformance ranks node providers.
func (s *Service) GetOperatorPerformance(ctx context.Context) ([]OperatorPerformance, error) {
	nodlrs := s.accountStore.ListNodlrs()
	results := make([]OperatorPerformance, 0, len(nodlrs))

	for _, n := range nodlrs {
		rev, _, _, _ := s.accountStore.GetOperatorLedgerTotals(n.ID)
		
		results = append(results, OperatorPerformance{
			OperatorID:        n.ID,
			Email:             n.Email,
			TotalRevenue:      rev,
			TotalJobs:         len(s.accountStore.GetLedgerHistory(n.ID)), // Approximation
			UptimePerformance: 0.999,
			JoinDate:          n.CreatedAt,
			Role:              string(n.Role),
			Status:            n.Status,
		})
	}

	sort.Slice(results, func(i, j int) bool {
		return results[i].TotalRevenue > results[j].TotalRevenue
	})
	
	for i := range results {
		results[i].Ranking = i + 1
	}

	return results, nil
}

// GetFounderEconomics provides visibility into tree root performance.
func (s *Service) GetFounderEconomics(ctx context.Context) ([]FounderOverrideTrace, error) {
	nodlrs := s.accountStore.ListNodlrs()
	results := []FounderOverrideTrace{}

	for _, n := range nodlrs {
		if n.IsFounder {
			results = append(results, FounderOverrideTrace{
				FounderID:           n.ID,
				FounderEmail:        n.Email,
				TotalAccruedCents:   n.AccruedFounderBalance,
				TreeSize:            0, // Calculated in real tree resolution
				GrowthRate:          5.5, // Mock 
				RunRateContribution: int64(float64(n.AccruedFounderBalance) / 10), // Mock 30d avg
				InfiniteDepth:       true,
			})
		}
	}

	return results, nil
}

// GetPlatformEconomics returns treasury and forecasting data.
func (s *Service) GetPlatformEconomics(ctx context.Context) (*PlatformEconomics, error) {
	rev, paid, pending := s.accountStore.GetGlobalLedgerStats()
	treasury := rev - paid - pending
	
	// 90d Forecast based on current 7d run rate
	runRate, _ := s.GetRunRate(ctx, 7)
	forecast := treasury + (runRate.DailyAverageCents * 90)

	ratio := 0.0
	if rev > 0 {
		ratio = float64(treasury) / float64(rev)
	}

	return &PlatformEconomics{
		PlatformRevenue:  int64(float64(rev) * 0.07),
		TreasuryBalance:  treasury,
		TreasuryForecast: forecast,
		ReserveRatio:     ratio,
	}, nil
}
