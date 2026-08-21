package institutional

import (
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
)

// InstitutionalOverview represents global system state.
type InstitutionalOverview struct {
	Timestamp            time.Time `json:"timestamp"`
	TotalRevenueCents    int64     `json:"totalRevenueCents"`
	TotalPayoutsCents    int64     `json:"totalPayoutsCents"`
	TreasuryBalanceCents int64     `json:"treasuryBalanceCents"`
	ActiveNodeCount      int       `json:"activeNodeCount"`
	TotalOperatorCount   int       `json:"totalOperatorCount"`
	NetworkIntegrity     float64   `json:"networkIntegrity"`
	PlatformProfitMargin float64   `json:"platformProfitMargin"`
}

// RunRateAggregate defines rolling financial projections.
type RunRateAggregate struct {
	PeriodDays         int     `json:"periodDays"`
	TotalVolumeCents   int64   `json:"totalVolumeCents"`
	OperatorShareCents int64   `json:"operatorShareCents"`
	PlatformShareCents int64   `json:"platformShareCents"`
	FounderShareCents  int64   `json:"founderShareCents"`
	DailyAverageCents  int64   `json:"dailyAverageCents"`
	ProjectedYearly    int64   `json:"projectedYearly"`
}

// RevenueMetric defines time-series revenue data.
type RevenueMetric struct {
	Period string `json:"period"` // e.g. "2024-W12" or "2024-04-17"
	Amount int64  `json:"amount"`
	Count  int    `json:"count"`
}

// OperatorPerformance ranks node providers.
type OperatorPerformance struct {
	OperatorID        string    `json:"operatorId"`
	Email             string    `json:"email"`
	TotalRevenue      int64     `json:"totalRevenue"`
	TotalJobs         int       `json:"totalJobs"`
	UptimePerformance float64   `json:"uptimePerformance"`
	JoinDate          time.Time `json:"joinDate"`
	Role              string    `json:"role"`
	Status            account.OpStatus    `json:"status"`
	Ranking           int       `json:"ranking"`
}

// FounderOverrideTrace provides auditability for tree root earnings.
type FounderOverrideTrace struct {
	FounderID         string `json:"founderId"`
	FounderEmail      string `json:"founderEmail"`
	TotalAccruedCents int64  `json:"totalAccruedCents"`
	TreeSize          int    `json:"treeSize"`
	GrowthRate        float64 `json:"growthRate"` // % change over 30d
	RunRateContribution int64 `json:"runRateContribution"`
	InfiniteDepth     bool   `json:"infiniteDepth"`
}

// PlatformEconomics focuses on treasury and reserves.
type PlatformEconomics struct {
	PlatformRevenue int64   `json:"platformRevenue"` // 7% cut
	TreasuryBalance int64   `json:"treasuryBalance"`
	TreasuryForecast int64  `json:"treasuryForecast"` // 90d trend
	ReserveRatio    float64 `json:"reserveRatio"`
}
