package acquisition

import (
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
)

// ReferralNode represents a single vertex in the acquisition graph.
type ReferralNode struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	ParentID  string    `json:"parentId"`
	Level     int       `json:"level"`     // 1 (Direct), 2 (Indirect)
	Revenue   int64     `json:"revenue"`   // Lifetime revenue for this referral in cents
	Status    account.OpStatus `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

// AcquisitionOverview provides a high-level summary of a user's referral performance.
type AcquisitionOverview struct {
	TotalReferrals   int     `json:"totalReferrals"`
	L1Count          int     `json:"l1Count"`
	L2Count          int     `json:"l2Count"`
	TotalRevenue     int64   `json:"totalRevenue"`     // Lifetime earnings from referrals
	ConversionRate   float64 `json:"conversionRate"`   // Active vs Total
	ActivationVolume int64   `json:"activationVolume"` // Revenue in last 30 days
}

// AcquisitionStats provides detailed breakdown of conversion and growth.
type AcquisitionStats struct {
	ActiveReferrals int `json:"activeReferrals"`
	NodesPerDirect  float64 `json:"nodesPerDirect"` // Average L2s per L1
	MonthlyGrowth   float64 `json:"monthlyGrowth"` // Revenue growth %
}

// AffiliateNode represents a node in the lazy-loaded tree.
type AffiliateNode struct {
	NodlrID   string           `json:"nodlrId"`
	NodeCount int              `json:"nodeCount"`
	L1Count   int              `json:"l1Count"`
	L2Count   int              `json:"l2Count"`
	Active    bool             `json:"active"`
	Children  []*AffiliateNode `json:"children"`
}

// AffiliateTreeResponse is the payload for the initial tree load.
type AffiliateTreeResponse struct {
	Summary struct {
		TotalAffiliates  int     `json:"totalAffiliates"`
		ActiveAffiliates int     `json:"activeAffiliates"`
		TotalNodes       int     `json:"totalNodes"`
		Growth30d        float64 `json:"growth30d"`
	} `json:"summary"`
	Founders []*AffiliateNode `json:"founders"`
}

// AcquisitionIntegrity provides audit results for the acquisition subsystem.
type AcquisitionIntegrity struct {
	ReferralDiscrepancies int      `json:"referralDiscrepancies"` // Graph vs Ledger mismatches
	LedgerCoherent        bool     `json:"ledgerCoherent"`
	Notes                []string `json:"notes"`
}
