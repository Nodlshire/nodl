package account

import (
	"regexp"
	"time"
)

var MeshClientIDRegex = regexp.MustCompile(`^M[0-9]-[0-9]{6}-[0-9]{4}$`)

// PayoutFrequency defines how often a nodlr receives funds.
type PayoutFrequency string

const (
	PayoutDaily  PayoutFrequency = "daily"
	PayoutWeekly PayoutFrequency = "weekly"
)

// PayoutStatus defines if a nodlr is ready to receive funds.
type PayoutStatus string

const (
	PayoutStatusActive     PayoutStatus = "active"
	PayoutStatusBlocked    PayoutStatus = "blocked"
	PayoutStatusPending    PayoutStatus = "pending_stripe"
)

// Nodlr represents a participant in the Nodl network.
type Nodlr struct {
	ID                    string          `json:"id"`
	NodlrID               string          `json:"nodlrId"`
	MeshClientID          string          `json:"meshClientId"`
	Name                  string          `json:"name"`
	Email                 string          `json:"email"`
	AvatarURL             string          `json:"avatar_url"`
	StripeConnectID       string          `json:"stripeConnectId"`
	StripeAccountID       string          `json:"stripeAccountId"`
	Status                string          `json:"status"` // pending_stripe, active
	PayoutStatus          PayoutStatus    `json:"payoutStatus"`
	IntegrityScore        int             `json:"integrityScore"`        // 0-1000
	AccruedFounderBalance int64           `json:"accruedFounderBalance"` // Cents
	IsFounder             bool            `json:"isFounder"`
	FounderIndex          int             `json:"founderIndex,omitempty"` // 1-5
	PayoutFrequency       PayoutFrequency `json:"payoutFrequency"`
	ParentID              string          `json:"parentId,omitempty"` // Direct sponsor
	Nodes                 []string        `json:"nodes"`              // CRM requirement
	Affiliates            []string        `json:"affiliates"`         // CRM requirement
	CreatedAt             time.Time       `json:"createdAt"`
}

// AffiliateRelation represents a link in the tree.
// While ParentID is in Nodlr, this helps with indexing children.
type AffiliateRelation struct {
	ParentID  string    `json:"parentId"`
	ChildID   string    `json:"childId"`
	Level     int       `json:"level"` // 1 or 2
	CreatedAt time.Time `json:"createdAt"`
}

// CommissionRole defines who receives a cut.
type CommissionRole string

const (
	RolePlatform CommissionRole = "platform"
	RoleFounder  CommissionRole = "founder"
	RoleLevel1   CommissionRole = "level1"
	RoleLevel2   CommissionRole = "level2"
	RoleOrigin   CommissionRole = "origin"
)

// CommissionRecord tracks a single payout slice.
type CommissionRecord struct {
	ID            string         `json:"id"`
	TransactionID string         `json:"transactionId"`
	RecipientID   string         `json:"recipientId"`
	Role          CommissionRole `json:"role"`
	AmountCents   int64          `json:"amountCents"`
	Status        string         `json:"status"` // pending, paid
	CreatedAt     time.Time      `json:"createdAt"`
}

// Payout tracks a batch of commissions sent to a nodlr.
type Payout struct {
	ID              string          `json:"id"`
	NodlrID         string          `json:"nodlrId"`
	StripePayoutID  string          `json:"stripePayoutId"`
	AmountCents     int64           `json:"amountCents"`
	Frequency       PayoutFrequency `json:"frequency"`
	Status          string          `json:"status"`
	PeriodStart     time.Time       `json:"periodStart"`
	PeriodEnd       time.Time       `json:"periodEnd"`
	CreatedAt       time.Time       `json:"createdAt"`
}

// ComputeRecord tracks earnings from compute work.
type ComputeRecord struct {
	OperatorID string    `json:"operatorId"`
	Amount     int64     `json:"amount"` // cents
	Timestamp  time.Time `json:"timestamp"`
}

// PayoutRecord tracks a single Stripe transfer/payout event.
type PayoutRecord struct {
	OperatorID       string    `json:"operatorId"`
	Amount           int64     `json:"amount"` // cents
	StripeTransferID string    `json:"stripeTransferId"`
	Status           string    `json:"status"` // pending, paid, failed
	Timestamp        time.Time `json:"timestamp"`
}

// OperatorSummary provides an overview of an operator's finances.
type OperatorSummary struct {
	TotalCompute    int64     `json:"total_compute"`
	TotalPaid       int64     `json:"total_paid"`
	TotalPending    int64     `json:"total_pending"`
	LastPayout      time.Time `json:"last_payout"`
	StripeAccountID string    `json:"stripe_account_id"`
	PayoutStatus    string    `json:"payout_status"`
}

// PayoutArchitecture defines the Stripe identities for a 6-tier sovereign split.
type PayoutArchitecture struct {
	OperatorStripe    string
	SalesSourceStripe string
	L1Stripe          string
	L2Stripe          string
	FounderStripe     string
}
