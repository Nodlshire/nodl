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

// OpStatus defines operational and verification state for the CRM.
type OpStatus struct {
	Active                bool       `json:"active"`
	Verification          string     `json:"verification"` // verified, pending, error
	VerificationReason    string     `json:"verificationReason,omitempty"`
	VerificationUpdatedAt *time.Time `json:"verificationUpdatedAt,omitempty"`
}

// PayoutStatus defines if a nodlr is ready to receive funds.
type PayoutStatus string

const (
	PayoutStatusPending    PayoutStatus = "pending"
	PayoutStatusIncomplete PayoutStatus = "incomplete"
	PayoutStatusActive     PayoutStatus = "active"
)

// UserRole defines the RBAC levels for the platform.
type UserRole string

const (
	RoleOwner           UserRole = "owner"            // Sovereign (Cardinality: 1)
	RoleExecutive       UserRole = "executive"        // Governance Voters (75%)
	RoleShareholder     UserRole = "shareholder"      // Escalation Voters (80%)
	RoleManagement      UserRole = "management"       // Personnel/Operator managers
	RoleCustomerService UserRole = "customer_service" // Support limited access
	RoleVisitor         UserRole = "visitor"          // Read-only transparency
	RoleFounder         UserRole = "founder"          // Economic override (3%)
	RolePartner         UserRole = "partner"          // Partner slot (Slots 5-10)
	RoleFounderNodlr     UserRole = "founder_nodlr"    // Sovereign Foundation logic
	RoleOperator         UserRole = "operator"         // Nodlr node provider (80%)
	RoleBuyer           UserRole = "buyer"            // Mesh compute buyer
	RoleStandard        UserRole = "standard"         // Legacy default
	RoleObserver        UserRole = "observer"         // Global read-only
)

var ObserverPermissions = []string{
	"read_all",
	"view_nodes",
	"view_financials",
	"view_affiliates",
	"view_personnel",
	"view_settings",
	"view_system",
}

const (
	PctOperator        = 0.70 // The node operator providing compute (Compute)
	PctSalesSource     = 0.10 // The Perpetual Growth Agent (Sales Source)
	PctLevel1          = 0.03 // Immediate direct referral (L1)
	PctLevel2          = 0.07 // Secondary referral (L2)
	PctPlatform        = 0.07 // Wnode infrastructure (Protocol)
	PctFounderOverride = 0.03 // Genesis lineage benefit (Founder)
)

// Archetype defines the specific functional class of an identity or node.
type Archetype string

const (
	ArchetypeStandard Archetype = "standard"
	ArchetypeAASP     Archetype = "AA:SP" // Autonomous Agent: Space Provider
)


// Nodlr represents a participant in the Nodl network.
type Nodlr struct {
	ID                    string          `json:"id"`
	Email                 string          `json:"email"`
	Password              string          `json:"password,omitempty"`
	FirstName             string          `json:"firstName,omitempty"`
	LastName              string          `json:"lastName,omitempty"`
	DisplayName           string          `json:"displayName,omitempty"`
	MeshClientID          string          `json:"meshClientId"`
	StripeConnectID       string          `json:"stripeConnectId"`
	StripeAccountID       string          `json:"stripeAccountId"` // Phase 3 Mapping
	FounderStripeAccountID *string         `json:"founderStripeAccountId"`
	NodlrStripeAccountID   *string         `json:"nodlrStripeAccountId"`
	Role                  UserRole        `json:"role"`
	Permissions           []string        `json:"permissions,omitempty"`
	PayoutStatus          PayoutStatus    `json:"payoutStatus"`
	PayoutsEnabled        bool            `json:"payoutsEnabled"`
	VerificationStatus    string          `json:"verificationStatus"`
	IntegrityScore        int             `json:"integrityScore"` // 0-1000
	IsFrozen              bool            `json:"isFrozen"`       // Constitutional hold
	FrozenAt              *time.Time      `json:"frozenAt,omitempty"`
	AccruedFounderBalance int64           `json:"accruedFounderBalance"`
	WalletBalance         int64           `json:"walletBalance"`
	PendingBalanceCents   int64           `json:"pendingBalanceCents"` // Ready for payout
	EscrowBalanceCents    int64           `json:"escrowBalanceCents"`  // Held until Stripe active
	IsFounder             bool            `json:"isFounder"`
	FounderIndex          int             `json:"founderIndex,omitempty"`
	PayoutFrequency       PayoutFrequency `json:"payoutFrequency"`
	ParentID              string          `json:"parentId,omitempty"`
	Status                OpStatus        `json:"status"`
	IsProtected           bool            `json:"isProtected"`
	IsSuperAdmin          bool            `json:"isSuperAdmin"`
	OnboardingComplete    bool            `json:"onboardingComplete"`
	Verified              bool            `json:"verified"`
	Labels                []string        `json:"labels"`
	Archetype             Archetype       `json:"archetype,omitempty"`
	CreatedAt             time.Time       `json:"createdAt"`
	TOTPSecret            string          `json:"totpSecret,omitempty"`
	TOTPEnabled           bool            `json:"totpEnabled"`
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
	CommRolePlatform CommissionRole = "platform"
	CommRoleFounder  CommissionRole = "founder"
	CommRoleLevel1   CommissionRole = "level1"
	CommRoleLevel2   CommissionRole = "level2"
	CommRoleOrigin   CommissionRole = "origin"
	CommRoleWnode    CommissionRole = "wnode"
	CommRoleSalesSource CommissionRole = "sales_source"
	CommRoleEscrow   CommissionRole = "escrow"
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

// WnodeNode represents a physical or virtual machine connected to the network.
type WnodeNode struct {
	CPUCores           int                `json:"cpu_cores"`
	MemoryGB           int                `json:"memory_gb"`
	Latitude           float64            `json:"lat"`
	Longitude          float64            `json:"lon"`
	IPAddress          string             `json:"ipAddress"`
	ID                 string             `json:"id"`
	UserID             string             `json:"userId"`
	OperatorWUID       string             `json:"operator_wuid"`
	CRMLink            string             `json:"crm_link"`
	DeviceToken        string             `json:"-"` // Long-lived secure secret
	Metadata           NodeMetadata       `json:"metadata"`
	Status             string             `json:"status"` // active, offline
	CreatedAt          time.Time          `json:"createdAt"`
	LastSeen           time.Time          `json:"lastSeen"`
	LastHeartbeat      string             `json:"last_heartbeat"`
	LastSeenAt         string             `json:"last_seen_at"`
	Metrics            *NodeHealthMetrics `json:"metrics,omitempty"`
	GlobalScore        float64            `json:"globalScore"`
	Tier               int                `json:"tier"` // Phase 11 capability tier (1-5)
	IsWASM             bool               `json:"isWasm"`
	DowntimePenalized  bool               `json:"downtimePenalized"`
	DowntimeSlashed    bool               `json:"downtimeSlashed"`
	HardwareHash       string             `json:"hardwareHash,omitempty"`
	BrowserFingerprint string             `json:"browserFingerprint,omitempty"`
	DeviceClass        string             `json:"deviceClass,omitempty"`
}

func CalculateTier(computeScore float64) int {
	if computeScore >= 90 {
		return 1
	} else if computeScore >= 60 {
		return 2
	} else if computeScore >= 30 {
		return 3
	} else if computeScore >= 10 {
		return 4
	}
	return 5
}

type ReputationMetrics struct {
	LocalScore         float64 `json:"localScore"`
	UptimeHours        int64   `json:"uptimeHours"`
	SuccessRate        float64 `json:"successRate"`
	AvgShardDurationMs int64   `json:"avgShardDurationMs"`
	TotalWU            int     `json:"totalWU"`
	TotalRewards       float64 `json:"totalRewards"`
}

// NodeHealthMetrics captures dynamic telemetry from a node.
type NodeHealthMetrics struct {
	CPUCores    int                `json:"cpuCores"`
	MemoryGB    int                `json:"memoryGb"`
	CPUModel    string             `json:"cpuModel,omitempty"`
	OS          string             `json:"os,omitempty"`
	CPU         float64            `json:"cpu"`
	RAM         float64            `json:"ram"`
	Disk        float64            `json:"disk"`
	Uptime      int64              `json:"uptime"`
	Temperature float64            `json:"temperature,omitempty"`
	Network     string             `json:"network"`
	Reputation  *ReputationMetrics `json:"reputation,omitempty"`
	CurrentLoad  int                `json:"currentLoad"`
	ComputeScore float64            `json:"computeScore"`
	CPUScore     float64            `json:"cpuScore"`
	GPUScore     float64            `json:"gpuScore"`
	MemoryScore  float64            `json:"memoryScore"`
	IsWASM       bool               `json:"isWasm"`
	TasksCompleted int              `json:"tasksCompleted,omitempty"`
}

// NodeMetadata captures hardware or environment specs.
type NodeMetadata struct {
	OS          string `json:"os"`
	Hostname    string `json:"hostname,omitempty"`
	UserAgent   string `json:"userAgent,omitempty"`
	CPU         string `json:"cpu,omitempty"`
	GPU         string `json:"gpu,omitempty"`
	RAM         string `json:"ram,omitempty"`
}

// PairingCode represents a short-lived link between a user and a pending node.
type PairingCode struct {
	Code      string    `json:"code"` // Format: WN-XXXX-YYYY
	UserID    string    `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
}

// PayoutArchitecture defines the iron-clad, 6-tier deterministic payout map for a node.
type PayoutArchitecture struct {
	NodlrID           string `json:"nodlrId"`           // 70%
	SalesSourceID     string `json:"salesSourceId"`     // 10%
	L1ID              string `json:"l1Id"`              // 3%
	L2ID              string `json:"l2Id"`              // 7%
	FounderID         string `json:"founderId"`         // 3%
	WnodeID           string `json:"wnodeId"`           // 7%

	// Stripe Destinations (Resolved IDs)
	NodlrStripe       string `json:"nodlrStripe"`
	SalesSourceStripe string `json:"salesSourceStripe"`
	L1Stripe          string `json:"l1Stripe"`
	L2Stripe          string `json:"l2Stripe"`
	FounderStripe     string `json:"founderStripe"`
	WnodeStripe       string `json:"wnodeStripe"`
}

// MeshClient represents a customer or entity utilizing the compute mesh.
type MeshClient struct {
	ID            string    `json:"id"`
	SalesSourceID string    `json:"salesSourceId"` // 10% Perpetual Growth Agent
	CreatedAt     time.Time `json:"createdAt"`
}

// Lineage defines the iron-clad economic ancestry for a transaction (6-tier distribution).
type Lineage struct {
	NodlrID       string `json:"nodlrId"`       // 70% (Compute)
	SalesSourceID string `json:"salesSourceId"` // 10% (Sales Source)
	L1ID          string `json:"l1Id"`          // 3%
	L2ID          string `json:"l2Id"`          // 7%
	FounderID     string `json:"founderId"`     // 3%
	WnodeID       string `json:"wnodeId"`       // 7%
}

// Ambassador Intelligence Suite - Opportunity Audit Models
type OpportunityAudit struct {
	NodlrID                    string             `json:"nodlrId"`
	EarnedSalesCents           int64              `json:"earnedSalesCents"`
	MissedComputeCents         int64              `json:"missedComputeCents"`
	CaptureEfficiencyPercentage float64            `json:"captureEfficiencyPercentage"` // (EarnedSalesCents / (EarnedSalesCents + (MissedComputeCents / 7))) * 100? No, let's use the 100% potential base.
	PotentialMonthlyTotalCents int64              `json:"potentialMonthlyTotalCents"`
	Events                     []OpportunityEvent `json:"events"`
	ExpansionInsight           ExpansionInsight   `json:"expansionInsight"`
}

type OpportunityEvent struct {
	JobID       string `json:"jobId"`
	AmountCents int64  `json:"amountCents"` // The 70% portion
	Category    string `json:"category"`    // CAPACITY_LIMIT, HARDWARE_GAP, DOWNTIME
	Reason      string `json:"reason"`
	Timestamp   time.Time `json:"timestamp"`
}

type ExpansionInsight struct {
	Analysis      string  `json:"analysis"`
	MissedMonthly float64 `json:"missedMonthly"`
}

// InviteToken represents a one-time invitation to the platform (primarily for Command).
type InviteToken struct {
	Token     string    `json:"token"`
	Email     string    `json:"email"`
	Domain    string    `json:"domain"`
	Role      UserRole  `json:"role"`
	ExpiresAt time.Time `json:"expiresAt"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
}

// MagicLinkToken represents a short-lived login token sent via email.
type MagicLinkToken struct {
	Token     string    `json:"token"`
	Email     string    `json:"email"`
	Domain    string    `json:"domain"`
	ExpiresAt time.Time `json:"expiresAt"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
}

// HeadlessToken represents a registration token for a headless node.
type HeadlessToken struct {
	Token     string    `json:"token"`
	UserID    string    `json:"userId"`
	Profile   string    `json:"profile"`
	ExpiresAt time.Time `json:"expiresAt"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"createdAt"`
}

// DomainSession represents a verified session for a specific identity domain.
type DomainSession struct {
	WUID         string    `json:"wuid"`
	Domain       string    `json:"domain"`
	Role         UserRole  `json:"role"`
	TwoFAEnabled bool      `json:"twoFAEnabled"`
	TwoFAVerified bool     `json:"twoFAVerified"`
	ExpiresAt    time.Time `json:"expiresAt"`
	CreatedAt    time.Time `json:"createdAt"`
}

// WUIDHardwareMapping explicitly maps a human WUID to a specific hardware node.
type WUIDHardwareMapping struct {
	WUID               string    `json:"wuid"`
	HardwareHash       string    `json:"hardwareHash"`
	BrowserFingerprint string    `json:"browserFingerprint,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
}

// CRMRecord represents the authoritative identity and contact data for a platform participant.
type CRMRecord struct {
	NodlrID      string    `json:"nodlrId"`
	BusinessName string    `json:"businessName"`
	Phone        string    `json:"phone"`
	Avatar       string    `json:"avatar"`
	Labels       []string  `json:"labels"`
	CreatedAt    time.Time `json:"createdAt"`
}

// CRMUpdate is used for incoming PUT requests to the CRM.
type CRMUpdate struct {
	BusinessName string `json:"businessName"`
	Phone        string `json:"phone"`
}

// AffiliateInvite represents a generated, single-use invite link payload and record.
type AffiliateInvite struct {
	ID                  string    `json:"id"`
	InviterWUID         string    `json:"inviterWuid"` // WUID or "global" or "owner"
	PlacementTargetWUID string    `json:"placementTargetWuid"` // WUID or "roundrobin" or ""
	Role                string    `json:"role"`        // "affiliate", "founder"
	FounderSlot         int       `json:"founderSlot,omitempty"` // 1-4
	Token               string    `json:"token"`
	Used                bool      `json:"used"`
	ExpiresAt           time.Time `json:"expiresAt"`
	CreatedAt           time.Time `json:"createdAt"`
}

// InviteState tracks the global round-robin pointer and valid tokens.
type InviteState struct {
	Secret           string                      `json:"secret"`
	NextFounderIndex int                         `json:"nextFounderIndex"`
	Registry         map[string]*AffiliateInvite `json:"registry"`
}

// Phase 10: Governance Read-Only DTOs

type GovernanceSummary struct {
	TotalNodes         int  `json:"totalNodes"`
	TotalAffiliates    int  `json:"totalAffiliates"`
	TotalPartners      int  `json:"totalPartners"`
	TotalFounders      int  `json:"totalFounders"`
	RoundRobinPosition int  `json:"roundRobinPosition"`
	IntegrityHealthy   bool `json:"integrityHealthy"`
}

type IntegritySnapshot struct {
	LineageSummary      map[string]int `json:"lineageSummary"`
	SyntheticWUIDs      []string       `json:"syntheticWUIDs"`
	CorruptionFlags     bool           `json:"corruptionFlags"`
}

type PartnerStatus struct {
	Slot   int    `json:"slot"`
	WUID   string `json:"wuid"`
	Status string `json:"status"` // "empty", "filled"
}

type PartnerOverview struct {
	PartnerCount   int               `json:"partnerCount"`
	PartnerList    []PartnerStatus   `json:"partnerList"`
	PartnerInvites []*AffiliateInvite `json:"partnerInvites"`
}

type FounderSlotStatus struct {
	Slot   int    `json:"slot"`
	WUID   string `json:"wuid"`
	Status string `json:"status"` // "empty", "filled"
}

type FounderSlotsResponse struct {
	Founders []FounderSlotStatus `json:"founders"`
	Invites  []*AffiliateInvite  `json:"invites"`
}
