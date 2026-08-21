package money

import "time"

// MoneyOverview is the top-level aggregation of financial data for the Command layer.
type MoneyOverview struct {
	Operator           OperatorMoneyView      `json:"operator"`
	Founder            FounderMoneyView       `json:"founder"`
	Platform           PlatformMoneyView      `json:"platform"`
	Node               NodeStatus             `json:"node"`
	TreasurySimulation TreasurySimulationView `json:"treasury_simulation"`
	Alerts             FinancialAlertsView    `json:"alerts"`
	Integrity          IntegritySnapshot      `json:"integrity"`
}

// OperatorMoneyView provides a read-only perspective on an operator's earnings.
type OperatorMoneyView struct {
	Email           string        `json:"email"`
	StripeAccountID string        `json:"stripe_account_id"`
	TotalCompute    int64         `json:"total_compute"`
	TotalPaid       int64         `json:"total_paid"`
	TotalPending    int64         `json:"total_pending"`
	LastPayout      time.Time     `json:"last_payout"`
	PayoutStatus    string        `json:"payout_status"`
	StripeHealth    *StripeHealth `json:"stripe_health,omitempty"`
}

// FounderMoneyView provides a read-only perspective on founder overrides.
type FounderMoneyView struct {
	Email                string `json:"email"`
	TotalOverride        int64  `json:"total_override"`        // Legacy compatibility
	TotalReceived        int64  `json:"total_received"`        // Legacy compatibility
	PendingOverride      int64  `json:"pending_override"`      // Legacy compatibility
	TotalOverrideEarned  int64  `json:"total_override_earned"`  // 3% platform-wide
	TotalOverridePaid    int64  `json:"total_override_paid"`    // Always 0 for now
	TotalOverridePending int64  `json:"total_override_pending"` // Earned - Paid
	FounderEmail         string `json:"founder_email"`
}

// PlatformMoneyView provides a read-only perspective on global platform health.
type PlatformMoneyView struct {
	TotalRevenue         int64         `json:"total_revenue"`
	TotalPayouts         int64         `json:"total_payouts"`
	TreasuryBalance      int64         `json:"treasury_balance"`
	RevenueFromCompute   int64         `json:"revenue_from_compute"`
	RevenueFromFees      int64         `json:"revenue_from_fees"`
	Profitability        float64       `json:"profitability"`
	StripePlatformHealth *StripeHealth `json:"stripe_platform_health,omitempty"`
}

// TreasurySimulationView provide forward-looking platform financial projections.
type TreasurySimulationView struct {
	DailyInflowEstimate      int64   `json:"daily_inflow_estimate"`
	DailyOutflowEstimate     int64   `json:"daily_outflow_estimate"`
	NetDailyFlow             int64   `json:"net_daily_flow"`
	Projected7DayBalance     int64   `json:"projected_7_day_balance"`
	Projected30DayBalance    int64   `json:"projected_30_day_balance"`
	Projected90DayBalance    int64   `json:"projected_90_day_balance"`
	BurnRatePerDay           int64   `json:"burn_rate_per_day"`
	RunwayDays               int64   `json:"runway_days"`
	OverrideProjection       int64   `json:"override_projection"`
	OperatorPayoutProjection int64   `json:"operator_payout_projection"`
}

// FinancialAlertsView provides read-only indicators for platform financial risk thresholds.
type FinancialAlertsView struct {
	LowTreasuryWarning  bool     `json:"low_treasury_warning"`
	NegativeFlowWarning bool     `json:"negative_flow_warning"`
	ShortRunwayWarning  bool     `json:"short_runway_warning"`
	StripeHealthWarning bool     `json:"stripe_health_warning"`
	RevenueDropWarning  bool     `json:"revenue_drop_warning"`
	OperatorPayoutRisk  bool     `json:"operator_payout_risk"`
	FounderOverrideRisk bool     `json:"founder_override_risk"`
	Notes               []string `json:"notes"`
}

// IntegritySnapshot provides high-level financial health and audit consistency indicators.
type IntegritySnapshot struct {
	LedgerConsistent        bool     `json:"ledger_consistent"`
	StripeHealthConsistent  bool     `json:"stripe_health_consistent"`
	TreasuryNonNegative     bool     `json:"treasury_non_negative"`
	ComputeToRevenueAligned bool     `json:"compute_to_revenue_aligned"`
	Notes                   []string `json:"notes"`
}

// StripeHealth represents the read-only operational status of a connected account.
type StripeHealth struct {
	ChargesEnabled  bool `json:"charges_enabled"`
	PayoutsEnabled  bool `json:"payouts_enabled"`
	RequirementsDue bool `json:"requirements_due"`
}

// NodeStatus tracks node stability and online state.
type NodeStatus struct {
	Online        bool      `json:"online"`
	LastHeartbeat time.Time `json:"last_heartbeat"`
	UptimePercent float64   `json:"uptime_percent"`
}

// AcquisitionSummary provides an investor-facing snapshot of platform financial maturity.
type AcquisitionSummary struct {
	Timestamp       int64    `json:"timestamp"`
	SystemVersion   string   `json:"system_version"`
	TotalRevenue    int64    `json:"total_revenue"`
	TotalPayouts    int64    `json:"total_payouts"`
	TreasuryBalance int64    `json:"treasury_balance"`
	RunwayDays      int64    `json:"runway_days"`
	NetDailyFlow    int64    `json:"net_daily_flow"`
	AlertsActive    int      `json:"alerts_active"`
	IntegrityPass   bool     `json:"integrity_pass"`
	RiskScore       int      `json:"risk_score"`
	Notes           []string `json:"notes"`
}

// DueDiligenceBundle consolidates all platform financial intelligence for institutional stakeholders.
type DueDiligenceBundle struct {
	Timestamp          int64                  `json:"timestamp"`
	SystemVersion      string                 `json:"system_version"`
	Overview           MoneyOverview          `json:"overview"`
	Integrity          IntegritySnapshot      `json:"integrity"`
	Acquisition        AcquisitionSummary     `json:"acquisition"`
	Alerts             FinancialAlertsView    `json:"alerts"`
	TreasurySimulation TreasurySimulationView `json:"treasury_simulation"`
	Notes              []string               `json:"notes"`
}
