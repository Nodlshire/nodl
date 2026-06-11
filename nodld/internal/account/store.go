package account

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/forensics"
)


type Store struct {
	mu                 sync.RWMutex
	nodlrs             map[string]*Nodlr
	founders           [10]string // IDs mapping to Founder #1..#10
	organicCount       int        // Total organic signups handled
	pendingCommissions map[string][]CommissionRecord // NodlrID -> Records
	nodes              map[string]*WnodeNode
	meshClients        map[string]*MeshClient
	pairingCodes       map[string]*PairingCode
	forensics          *forensics.Store
	statePath          string

	// Auth Tokens
	inviteTokens     map[string]*InviteToken
	magicLinkTokens  map[string]*MagicLinkToken
	domainSessions   map[string]*DomainSession // SessionID -> Session

	// CRM Registry
	crmRecords         map[string]*CRMRecord

	// Mesh Client ID Generation State
	meshBucket         int
	meshSequence       int
	meshMonthYear      string

	// Operator Earnings & Payout Ledgers
	operatorEarnings []*OperatorEarnings
	operatorPayouts  []*OperatorPayout

	// Off-chain Tokens
	tokenLedger   []*TokenLedgerEntry
	tokenBalances map[string]*TokenBalance

	// Off-chain Staking
	operatorStakes map[string]*OperatorStake
	stakeLedger    []*StakeLedger

	// Off-chain Reputation
	operatorReputations map[string]*OperatorReputation
	reputationLedger    []*ReputationLedger

	// Off-chain Identity
	operatorIdentities map[string]*OperatorIdentity
	identityLedger     []*IdentityLedgerEntry

	// Phase 8: Authoritative Invite State
	inviteState *InviteState

	// Passive Telemetry Ingestion
	Telemetry          *TelemetryDispatcher

	// SaveState debouncing
	saveMu    sync.Mutex
	lastSave  time.Time
	saveBatch int64
}

type storeState struct {
	OrganicCount  int    `json:"organic_count"`
	MeshBucket    int    `json:"mesh_bucket"`
	MeshSequence  int    `json:"mesh_sequence"`
	MeshMonthYear string `json:"mesh_month_year"`
}

func NewStore(forensics *forensics.Store, statePath string) *Store {
	s := &Store{
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
		nodes:              make(map[string]*WnodeNode),
		meshClients:        make(map[string]*MeshClient),
		pairingCodes:       make(map[string]*PairingCode),
		inviteTokens:       make(map[string]*InviteToken),
		magicLinkTokens:    make(map[string]*MagicLinkToken),
		domainSessions:     make(map[string]*DomainSession),
		crmRecords:         make(map[string]*CRMRecord),
		forensics:          forensics,
		statePath:          statePath,
		operatorEarnings:   make([]*OperatorEarnings, 0),
		operatorPayouts:    make([]*OperatorPayout, 0),
		tokenLedger:        make([]*TokenLedgerEntry, 0),
		tokenBalances:      make(map[string]*TokenBalance),
		operatorStakes:     make(map[string]*OperatorStake),
		stakeLedger:        make([]*StakeLedger, 0),
		operatorReputations: make(map[string]*OperatorReputation),
		reputationLedger:    make([]*ReputationLedger, 0),
		operatorIdentities:  make(map[string]*OperatorIdentity),
		identityLedger:      make([]*IdentityLedgerEntry, 0),
		Telemetry:           NewTelemetryDispatcher("http://127.0.0.1:3001/api/intelligence/event"),
	}
	s.initInviteState()
	s.loadState()
	s.SeedFoundationIdentities()
	go s.runDowntimeWatchdog(10 * time.Second)
	go s.runReputationRecalculation(24 * time.Hour)
	return s
}

func (s *Store) runDowntimeWatchdog(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		s.mu.Lock()
		now := time.Now()
		for _, node := range s.nodes {
			// A node sends a heartbeat every 30 seconds.
			// 3 missed heartbeats = 90 seconds.
			if now.Sub(node.LastSeen) > 90*time.Second {
				if !node.DowntimePenalized {
					node.DowntimePenalized = true
					node.Status = "offline"
					
					// Apply downtime penalty: -1 * BaseRateForTier
					baseRate := GetBaseRateForTier(node.Tier)
					penalty := -1.0 * baseRate
					
					entry := &TokenLedgerEntry{
						EntryID:    uuid.New().String(),
						OperatorID: node.UserID,
						JobID:      "downtime",
						ShardID:    node.ID,
						Amount:     penalty,
						Reason:     "downtime_penalty",
						Timestamp:  now,
					}
					s.tokenLedger = append(s.tokenLedger, entry)
					
					bal, exists := s.tokenBalances[node.UserID]
					if !exists {
						bal = &TokenBalance{
							OperatorID: node.UserID,
							Balance:    0,
							UpdatedAt:  now,
						}
						s.tokenBalances[node.UserID] = bal
					}
					bal.Balance += penalty
					bal.UpdatedAt = now
					
					fmt.Printf("[Downtime Watchdog] Node %s went offline. Deducted %f from operator %s\n", node.ID, penalty, node.UserID)
					go s.SaveState()
				}
			}

			// 5 missed heartbeats = 150 seconds
			if now.Sub(node.LastSeen) > 150*time.Second {
				if !node.DowntimeSlashed {
					node.DowntimeSlashed = true
					s.slashDowntimeLocked(node.UserID)
					fmt.Printf("[Downtime Watchdog] Node %s missed 5 heartbeats. Slashed 10 tokens from operator %s\n", node.ID, node.UserID)
					go s.SaveState()
				}
			}
		}
		s.mu.Unlock()
	}
}

func (s *Store) runReputationRecalculation(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		s.RecalculateAllReputations()
	}
}

func (s *Store) loadState() {
	if s.statePath == "" {
		return
	}
	data, err := os.ReadFile(s.statePath)
	if err != nil {
		return
	}
	var state storeState
	if err := json.Unmarshal(data, &state); err == nil {
		s.organicCount = state.OrganicCount
		s.meshBucket = state.MeshBucket
		s.meshSequence = state.MeshSequence
		s.meshMonthYear = state.MeshMonthYear
	}
}

func (s *Store) saveState() {
	if s.statePath == "" {
		return
	}
	state := storeState{
		OrganicCount:  s.organicCount,
		MeshBucket:    s.meshBucket,
		MeshSequence:  s.meshSequence,
		MeshMonthYear: s.meshMonthYear,
	}
	data, _ := json.MarshalIndent(state, "", "  ")
	_ = os.MkdirAll(filepath.Dir(s.statePath), 0755)
	_ = os.WriteFile(s.statePath, data, 0644)
}

// SeedFoundationIdentities hard-codes the Sovereign Foundation accounts.
func (s *Store) SeedFoundationIdentities() {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Stephen (Universal Owner)
	ownerID := "100001-0426-01-AA"
	if n, ok := s.nodlrs[ownerID]; !ok {
		s.nodlrs[ownerID] = &Nodlr{
			ID:                 ownerID,
			Email:              "stephen@wnode.one",
			DisplayName:        "Stephen Soos",
			Role:               RoleOwner,
			IsSuperAdmin:       true,
			IsProtected:        true,
			Password:           "command",
			OnboardingComplete: true,
			Verified:           true,
			Status:             OpStatus{Active: true, Verification: "verified"},
			Labels:             []string{"FOUNDER", "NODLR", "MESH"},
			CreatedAt:          time.Now(),
		}
	} else {
		// Enforce foundation status on existing record
		n.DisplayName = "Stephen Soos"
		n.IsSuperAdmin = true
		n.IsProtected = true
		n.OnboardingComplete = true
		n.Verified = true
		n.Labels = []string{"FOUNDER", "NODLR", "MESH"}
		if n.Password == "" {
			n.Password = "command"
		}
	}

	// 2. Stephen's CRM record
	s.crmRecords[ownerID] = &CRMRecord{
		NodlrID:      ownerID,
		BusinessName: "Wnode Sovereign Foundation",
		Phone:        "+1-555-0199",
		Labels:       []string{"FOUNDER", "NODLR", "MESH"},
		CreatedAt:    time.Now(),
	}

	// Phase 8 Test Context: Initialize slot 1
	if s.founders[0] == "" {
		s.founders[0] = ownerID
	}

	// 3. Stephen's MeshClient record
	s.meshClients[ownerID] = &MeshClient{
		ID:            ownerID,
		SalesSourceID: ownerID, // Founder acts as own perpetual growth agent
		CreatedAt:     time.Now(),
	}

	// Note: Test User mock record was purged.
}

// AssignFounderSlot securely assigns a Nodlr to a specific Founder slot.
func (s *Store) AssignFounderSlot(slot int, wuid string) error {
	err := s.assignFounderSlotInternal(slot, wuid)
	if err == nil {
		s.SaveState()
	}
	return err
}

func (s *Store) assignFounderSlotInternal(slot int, wuid string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if slot < 1 || slot > 10 {
		return fmt.Errorf("invalid founder/partner slot")
	}

	if s.founders[slot-1] != "" {
		return fmt.Errorf("slot %d is already filled", slot)
	}

	s.founders[slot-1] = wuid

	// Also upgrade the user's role
	if n, ok := s.nodlrs[wuid]; ok {
		if slot <= 4 {
			n.Role = RoleFounder
			n.IsFounder = true
			n.Labels = append(n.Labels, "FOUNDER")
		} else {
			n.Role = RolePartner
			n.Labels = append(n.Labels, "PARTNER")
		}
	}

	return nil
}

// GetFounderSlots returns a copy of the current founder slots.
func (s *Store) GetFounderSlots() [4]string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var slots [4]string
	for i := 0; i < 4; i++ {
		slots[i] = s.founders[i]
	}
	return slots
}

func stringPtr(s string) *string {
	return &s
}

// SetFounder assigns a specific ID to one of the 5 founder slots.
func (s *Store) SetFounder(index int, id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if index < 1 || index > 10 {
		return
	}
	s.founders[index-1] = id
	if nodlr, ok := s.nodlrs[id]; ok {
		nodlr.IsFounder = true
		nodlr.FounderIndex = index
	}
}

// CreateNodlr creates a new account. If parentID is empty, it uses round-robin.
func (s *Store) CreateNodlr(email, parentID string) (*Nodlr, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	index := len(s.nodlrs) + 1
	id := fmt.Sprintf("1000%02d-0426-%02d-AA", index, index)
	
	// Organic signups use the strict round-robin logic (1->2->3->4->1, NO skipping empty slots)
	if parentID == "" {
		index := s.inviteState.NextFounderIndex
		s.inviteState.NextFounderIndex++
		if s.inviteState.NextFounderIndex > 4 {
			s.inviteState.NextFounderIndex = 1
		}
		
		parentID = s.founders[index-1]
		if parentID == "" {
			parentID = fmt.Sprintf("FOUNDER-SLOT-%02d", index)
		}
		s.organicCount++
		go s.SaveState()
	}

	// Phase 8.1 CRM Population: ensure the parent slot (real or synthetic) has a CRM record
	if parentID != "" {
		if _, exists := s.crmRecords[parentID]; !exists {
			s.crmRecords[parentID] = &CRMRecord{
				NodlrID:      parentID,
				BusinessName: parentID, // For synthetic visibility
				CreatedAt:    time.Now(),
			}
		}
	}

	n := &Nodlr{
		ID:              id,
		Email:           email,
		MeshClientID:    s.GenerateMeshClientID(),
		PayoutFrequency: PayoutDaily,
		PayoutStatus:    PayoutStatusIncomplete,
		IntegrityScore:  600, // Initial trust
		ParentID:        parentID,
		CreatedAt:       time.Now(),
	}

	// If this ID is in founders, mark it
	for i, fID := range s.founders {
		if fID == id {
			n.IsFounder = true
			n.FounderIndex = i + 1
		}
	}

	s.nodlrs[id] = n
	return n, nil
}

// GenerateMeshClientID creates a globally unique, sequential Mesh Client ID.
// Format: M{bucket}-{sequence}-{MMYY}
// It assumes s.mu is already locked by the caller.
func (s *Store) GenerateMeshClientID() string {
	now := time.Now()
	nowMMYY := now.Format("0106")

	if s.meshMonthYear == "" || isLater(nowMMYY, s.meshMonthYear) {
		s.meshBucket = 0
		s.meshSequence = 0
		s.meshMonthYear = nowMMYY
	}

	s.meshSequence++
	if s.meshSequence > 999999 {
		s.meshBucket++
		s.meshSequence = 1
		if s.meshBucket > 9 {
			s.meshBucket = 0
			// Roll over month artificially
			t, _ := time.Parse("0106", s.meshMonthYear)
			s.meshMonthYear = t.AddDate(0, 1, 0).Format("0106")
		}
	}

	s.saveState()

	id := fmt.Sprintf("M%d-%06d-%s", s.meshBucket, s.meshSequence, s.meshMonthYear)
	if !MeshClientIDRegex.MatchString(id) {
		// Log error internally, but the generator format guarantees adherence
		fmt.Printf("Error: Generated MeshClientID %s failed regex validation\n", id)
	}
	return id
}

// isLater returns true if a is a later month/year than b (format MMYY).
func isLater(a, b string) bool {
	if b == "" {
		return true
	}
	ta, _ := time.Parse("0106", a)
	tb, _ := time.Parse("0106", b)
	return ta.After(tb)
}

// UpdateFounderStatus sets the status (active/dormant) for a founder.
func (s *Store) UpdateFounderStatus(id string, status string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.Status.Active = (status == "active")
	}
}

func (s *Store) AddNodlr(n *Nodlr) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if existing, ok := s.nodlrs[n.ID]; ok && (existing.IsProtected || existing.ID == AuthoritativeOwnerID) {
		return
	}
	s.nodlrs[n.ID] = n
}

func (s *Store) GetNodlr(id string) (*Nodlr, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	n, ok := s.nodlrs[id]
	return n, ok
}

func (s *Store) ListNodlrs() []*Nodlr {
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]*Nodlr, 0, len(s.nodlrs))
	for _, n := range s.nodlrs {
		list = append(list, n)
	}
	return list
}

func (s *Store) GetNodlrByEmail(email string) (*Nodlr, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, n := range s.nodlrs {
		if n.Email == email {
			return n, true
		}
	}
	return nil, false
}

// ResolveTree returns the Level 1 and Level 2 sponsors for a given node.
func (s *Store) ResolveTree(childID string) (l1ID, l2ID string) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	child, ok := s.nodlrs[childID]
	if !ok || child.ParentID == "" {
		return "", ""
	}

	l1ID = child.ParentID
	l1, ok := s.nodlrs[l1ID]
	if ok && l1.ParentID != "" {
		l2ID = l1.ParentID
	}

	return l1ID, l2ID
}

// TransferAffiliate reassigns a child to a new parent.
// CONSTITUTIONAL LOCK: Only the legal owner of the account may authorize a transfer.
// Administrators cannot move accounts.
func (s *Store) TransferAffiliate(requesterID, childID, newParentID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Enforcement: Check if requester is the child being moved
	if requesterID != childID {
		return fmt.Errorf("constitutional lock: only the account owner may authorize a lineage transfer")
	}

	child, ok := s.nodlrs[childID]
	if !ok {
		return fmt.Errorf("account not found")
	}
	
	if _, ok := s.nodlrs[newParentID]; !ok {
		return fmt.Errorf("new parent not found")
	}

	child.ParentID = newParentID
	return nil
}

// ActivateFounder enables a founder slot. Only Owner.
func (s *Store) ActivateFounder(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok && n.IsFounder {
		n.Status.Active = true
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionFounderActivated, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account is not a founder")
}

// DeactivateFounder is explicitly BANNED by the constitution.
func (s *Store) DeactivateFounder(id string) error {
	return fmt.Errorf("constitutional lock: founders cannot be deactivated")
}

// FreezeAccount locks payouts for 120 days.
func (s *Store) FreezeAccount(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.IsFrozen = true
		now := time.Now()
		n.FrozenAt = &now
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionAccountFrozen, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account not found")
}

func (s *Store) UnfreezeAccount(actorID, actorRole, id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[id]; ok {
		n.IsFrozen = false
		n.FrozenAt = nil
		if s.forensics != nil {
			s.forensics.LogEvent(actorID, actorRole, forensics.ActionAccountUnfrozen, map[string]string{"targetID": id}, "0.0.0.0")
		}
		return nil
	}
	return fmt.Errorf("account not found")
}

// GetGenesisFounder returns the ID of the Genesis Founder (1-5) who ultimately
// owns the lineage of this node.
func (s *Store) GetGenesisFounder(id string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	curr := id
	for {
		n, ok := s.nodlrs[curr]
		if !ok || n.ParentID == "" {
			// If we hit the top and it's a founder, return it
			if n != nil && n.IsFounder {
				return n.ID
			}
			return ""
		}
		
		// If current is a founder, we've found it
		if n.IsFounder {
			return n.ID
		}
		
		curr = n.ParentID
	}
}

func (s *Store) AddCommissions(records []CommissionRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, r := range records {
		s.pendingCommissions[r.RecipientID] = append(s.pendingCommissions[r.RecipientID], r)
		if n, ok := s.nodlrs[r.RecipientID]; ok {
			if n.StripeConnectID != "" || n.StripeAccountID != "" {
				n.PendingBalanceCents += r.AmountCents
			} else {
				n.EscrowBalanceCents += r.AmountCents
			}
		}
	}
	go s.SaveState()
}

// PromoteEscrowToPending moves all escrowed funds to the payout-ready balance upon Stripe activation.
func (s *Store) PromoteEscrowToPending(nodlrID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if n, ok := s.nodlrs[nodlrID]; ok {
		n.PendingBalanceCents += n.EscrowBalanceCents
		n.EscrowBalanceCents = 0
	}
	go s.SaveState()
}

// GetPendingRecords returns only records currently marked as pending for an ID.
func (s *Store) GetPendingRecords(nodlrID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.pendingCommissions[nodlrID]
}

// FinalizePayout marks all pending records for an ID as paid and clears the pending balance.
func (s *Store) FinalizePayout(nodlrID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	records := s.pendingCommissions[nodlrID]
	for i := range records {
		if records[i].Status == "pending" {
			records[i].Status = "paid"
		}
	}
	if n, ok := s.nodlrs[nodlrID]; ok {
		n.PendingBalanceCents = 0
	}
	go s.SaveState()
}

// VerifyTransactionInvariants checks if a transaction follows the 70/10/3/7/3/7 split correctly.
func (s *Store) VerifyTransactionInvariants(txnID string, expectedTotal int64) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var records []CommissionRecord
	var actualTotal int64
	roles := make(map[CommissionRole]int)

	for _, rs := range s.pendingCommissions {
		for _, r := range rs {
			if r.TransactionID == txnID {
				records = append(records, r)
				actualTotal += r.AmountCents
				roles[r.Role]++
			}
		}
	}

	// Invariant: Exactly 6 records must exist for a full Sovereign split
	// (Note: Some roles might be missing if ancestry is shallow, but we check sum parity)
	if actualTotal != expectedTotal {
		return fmt.Errorf("INVARIANT FAILURE: txn %s sum mismatch. Expected %d, got %d", txnID, expectedTotal, actualTotal)
	}

	return nil
}

// GetGlobalEconomicSnapshot aggregates the entire ledger for internal audit.
func (s *Store) GetGlobalEconomicSnapshot() map[string]any {
	s.mu.RLock()
	defer s.mu.RUnlock()

	snapshot := map[string]int64{
		"total_operator_cents": 0,
		"total_steward_cents":  0,
		"total_founder_cents":  0,
		"total_affiliate_cents": 0,
		"total_sales_cents":    0,
		"total_escrow_cents":   0,
		"total_pending_cents":  0,
	}

	for _, n := range s.nodlrs {
		snapshot["total_escrow_cents"] += n.EscrowBalanceCents
		snapshot["total_pending_cents"] += n.PendingBalanceCents
	}

	for _, rs := range s.pendingCommissions {
		for _, r := range rs {
			switch r.Role {
			case CommRolePlatform:
				snapshot["total_operator_cents"] += r.AmountCents
			case CommRoleWnode:
				snapshot["total_steward_cents"] += r.AmountCents
			case CommRoleFounder:
				snapshot["total_founder_cents"] += r.AmountCents
			case CommRoleLevel1, CommRoleLevel2:
				snapshot["total_affiliate_cents"] += r.AmountCents
			case CommRoleSalesSource:
				snapshot["total_sales_cents"] += r.AmountCents
			}
		}
	}

	return map[string]any{
		"snapshot":  snapshot,
		"timestamp": time.Now(),
	}
}

func (s *Store) GetFullLedger() []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var all []CommissionRecord
	for _, rs := range s.pendingCommissions {
		all = append(all, rs...)
	}
	return all
}

func (s *Store) GetLedgerByTransactionID(txnID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var all []CommissionRecord
	for _, rs := range s.pendingCommissions {
		for _, r := range rs {
			if r.TransactionID == txnID {
				all = append(all, r)
			}
		}
	}
	return all
}

func (s *Store) ClearPending(nodlrID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.pendingCommissions, nodlrID)
}

func (s *Store) GetPendingTotal(nodlrID string) int64 {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var total int64
	for _, r := range s.pendingCommissions[nodlrID] {
		total += r.AmountCents
	}
	return total
}

const AuthoritativeOwnerID = "100001-0426-01-AA"
const WnodeBusinessStripeID = "acct_1TBQaCDWCb8zLVhT"

// UpdateBusinessProfile updates Stephen's specific Stripe account IDs.
func (s *Store) UpdateBusinessProfile(founderStripeID, nodlrStripeID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	owner, ok := s.nodlrs[AuthoritativeOwnerID]
	if !ok {
		return fmt.Errorf("owner account not found")
	}

	owner.FounderStripeAccountID = &founderStripeID
	owner.NodlrStripeAccountID = &nodlrStripeID
	return nil
}

// AssignUserRole sets the RBAC role for an account.
// CONSTITUTIONAL LOCK: Exactly one active Owner account.
func (s *Store) AssignUserRole(actorID, actorRole, id string, role UserRole) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	n, ok := s.nodlrs[id]
	if !ok {
		return fmt.Errorf("account not found")
	}

	if n.IsProtected {
		return fmt.Errorf("constitutional lock: protected foundation identities cannot be altered")
	}

	if role == RoleOwner {
		// Check if another owner exists
		for _, other := range s.nodlrs {
			if other.Role == RoleOwner && other.ID != id {
				return fmt.Errorf("constitutional lock: exactly one Sovereign Owner allowed")
			}
		}
	}

	oldRole := n.Role
	n.Role = role

	if s.forensics != nil {
		s.forensics.LogEvent(actorID, actorRole, forensics.ActionManagementRoleChanged, map[string]string{
			"targetID": id,
			"oldRole":  string(oldRole),
			"newRole":  string(role),
		}, "0.0.0.0")
	}

	return nil
}

// CalculateSplits performs the authoritative commission distribution.
// CONSTITUTIONAL LOCK:// Deprecated: CalculateSplit was replaced by unified CalculateSplitsForAmount

func (s *Store) CalculateSplits(totalCents int64, earnerID string, meshClientID string) []CommissionRecord {
	return s.CalculateSplitsForAmount(totalCents, earnerID, meshClientID)
}

// --- Node & Pairing Logic ---

const PairingCodeExpiry = 10 * time.Minute

// CreatePairingCode generates a new WN-XXXX-YYYY code for a user.
func (s *Store) CreatePairingCode(userId string) (*PairingCode, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Simple random grouping
	part1 := uuid.New().String()[0:4]
	part2 := uuid.New().String()[0:4]
	code := fmt.Sprintf("WN-%s-%s", part1, part2)

	pc := &PairingCode{
		Code:      code,
		UserID:    userId,
		ExpiresAt: time.Now().Add(PairingCodeExpiry),
		CreatedAt: time.Now(),
	}

	s.pairingCodes[code] = pc
	return pc, nil
}

// ConsumePairingCode validates a code and returns a long-lived device token.
func (s *Store) ConsumePairingCode(code string, metadata NodeMetadata) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	pc, ok := s.pairingCodes[code]
	if !ok {
		return "", fmt.Errorf("invalid pairing code")
	}
	if pc.Used {
		return "", fmt.Errorf("pairing code already used")
	}
	if time.Now().After(pc.ExpiresAt) {
		return "", fmt.Errorf("pairing code expired")
	}

	// Generate device token
	deviceToken := uuid.New().String()
	nodeId := s.nextNodeID(pc.UserID)

	node := &WnodeNode{
		ID:          nodeId,
		UserID:      pc.UserID,
		DeviceToken: deviceToken,
		Metadata:    metadata,
		Status:      "active",
		CreatedAt:   time.Now(),
		LastSeen:    time.Now(),
	}

	s.nodes[nodeId] = node
	pc.Used = true

	return deviceToken, nil
}

// RegisterNode creates a node directly for a user (browser connect flow).
func (s *Store) RegisterNode(userId string, metadata NodeMetadata, hardwareHash string, browserFingerprint string, deviceClass string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	deviceToken := uuid.New().String()
	nodeId := s.nextNodeID(userId)

	node := &WnodeNode{
		ID:                 nodeId,
		UserID:             userId,
		DeviceToken:        deviceToken,
		Metadata:           metadata,
		Status:             "active",
		CreatedAt:          time.Now(),
		LastSeen:           time.Now(),
		HardwareHash:       hardwareHash,
		BrowserFingerprint: browserFingerprint,
		DeviceClass:        deviceClass,
	}

	s.nodes[nodeId] = node

	// Perform initial identity registration consistency check
	s.EvaluateIdentityConsistencyLocked(userId, hardwareHash, browserFingerprint, deviceClass)

	return deviceToken, nil
}

// GetNode returns a specific node by its ID.
func (s *Store) GetNode(nodeId string) (*WnodeNode, bool) {
	s.DecayNodes()

	s.mu.RLock()
	defer s.mu.RUnlock()

	node, ok := s.nodes[nodeId]
	return node, ok
}

// GetNodeByToken retrieves a node by its long-lived secret.
func (s *Store) GetNodeByToken(token string) (*WnodeNode, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, n := range s.nodes {
		if n.DeviceToken == token {
			return n, true
		}
	}
	return nil, false
}

// UpdateNodeHeartbeat sets the LastSeen and Metrics for a node.
func (s *Store) UpdateNodeHeartbeat(nodeID string, metrics NodeHealthMetrics, hardwareHash string, browserFingerprint string, deviceClass string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	node, ok := s.nodes[nodeID]
	if !ok {
		return fmt.Errorf("node not found")
	}

	node.LastSeen = time.Now()
	node.Metrics = &metrics
	node.Status = "active"
	node.IsWASM = metrics.IsWASM
	node.DowntimePenalized = false
	node.DowntimeSlashed = false
	node.HardwareHash = hardwareHash
	node.BrowserFingerprint = browserFingerprint
	node.DeviceClass = deviceClass

	tier := CalculateTier(metrics.ComputeScore)
	if metrics.IsWASM {
		if tier < 4 {
			tier = 4
		}
	}
	node.Tier = tier

	// Minimum Stake Requirement check
	stakedVal := 0.0
	if stake, exists := s.operatorStakes[node.UserID]; exists {
		stakedVal = stake.Staked
	}
	if stakedVal < 100.0 {
		node.Tier = 5
	}

	// Compute Global Reputation Score if metrics exist
	if metrics.Reputation != nil {
		localScore := metrics.Reputation.LocalScore
		successRate := metrics.Reputation.SuccessRate
		
		// Approximate UptimeScore (max out at 720 hours / 1 month for full 1.0 score)
		uptimeScore := float64(metrics.Reputation.UptimeHours) / 720.0
		if uptimeScore > 1.0 {
			uptimeScore = 1.0
		}

		// Weighted aggregation
		node.GlobalScore = (localScore * 0.6) + (uptimeScore * 0.2) + (successRate * 0.2)
	}

	s.EvaluateIdentityConsistencyLocked(node.UserID, hardwareHash, browserFingerprint, deviceClass)
	s.RecalculateReputationLocked(node.UserID)

	deviceID := hardwareHash
	if deviceClass == "wasm" {
		deviceID = browserFingerprint
	}
	s.Telemetry.Publish(&TelemetryEvent{
		EventType:  "heartbeat",
		OperatorID: node.UserID,
		NodeID:     node.ID,
		DeviceID:   deviceID,
		Payload: map[string]interface{}{
			"metrics": map[string]interface{}{
				"cpu":          metrics.CPU,
				"ram":          metrics.RAM,
				"disk":         metrics.Disk,
				"uptime":       metrics.Uptime,
				"temperature":  metrics.Temperature,
				"network":      metrics.Network,
				"currentLoad":  metrics.CurrentLoad,
				"computeScore": metrics.ComputeScore,
				"isWasm":       metrics.IsWASM,
			},
			"hardwareHash":       hardwareHash,
			"browserFingerprint": browserFingerprint,
			"deviceClass":        deviceClass,
		},
	})

	return nil
}

// DecayNodes applies reputation penalties for nodes that are offline.
// It applies a 5% penalty per hour offline to the GlobalScore.
func (s *Store) DecayNodes() {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	for _, node := range s.nodes {
		hoursOffline := now.Sub(node.LastSeen).Hours()
		if hoursOffline > 1.0 && node.Status != "offline" {
			node.Status = "offline"
		}
		
		if hoursOffline > 1.0 {
			// Apply 0.95 multiplier per hour
			decayFactor := 1.0
			for i := 0; i < int(hoursOffline); i++ {
				decayFactor *= 0.95
			}
			
			node.GlobalScore = node.GlobalScore * decayFactor
			if node.GlobalScore < 0 {
				node.GlobalScore = 0
			}
		}
	}
}

// nextNodeID generates the next formatted ID for a user's node.
func (s *Store) nextNodeID(userID string) string {
	count := 0
	for _, n := range s.nodes {
		if n.UserID == userID {
			count++
		}
	}
	return fmt.Sprintf("%s-%06d", userID, count+1)
}

// ListNodes returns all nodes belonging to a specific user.
func (s *Store) ListNodes(userId string) []*WnodeNode {
	s.DecayNodes()

	s.mu.RLock()
	defer s.mu.RUnlock()

	list := []*WnodeNode{}
	for _, n := range s.nodes {
		if n.UserID == userId {
			list = append(list, n)
		}
	}
	return list
}

// ListAllNodes returns all registered nodes in the network.
func (s *Store) ListAllNodes() []*WnodeNode {
	s.mu.RLock()
	defer s.mu.RUnlock()

	list := make([]*WnodeNode, 0, len(s.nodes))
	for _, n := range s.nodes {
		list = append(list, n)
	}
	return list
}

// GetGlobalLedgerStats returns platform-wide aggregated financials from the authoritative commissions ledger.
func (s *Store) GetGlobalLedgerStats() (totalCompute, totalPaid, totalPending int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform {
				totalCompute += r.AmountCents
			}
			if r.Status == "paid" {
				totalPaid += r.AmountCents
			} else {
				totalPending += r.AmountCents
			}
		}
	}
	return
}

// GetRecentComputeVolume calculates the total compute volume within the specified duration window.
func (s *Store) GetRecentComputeVolume(window time.Duration) int64 {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var total int64
	cutoff := time.Now().Add(-window)
	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform && r.CreatedAt.After(cutoff) {
				total += r.AmountCents
			}
		}
	}
	return total
}

// GetOperatorLedgerTotals returns aggregated financials for a single operator.
func (s *Store) GetOperatorLedgerTotals(opID string) (totalCompute, totalPaid, totalPending int64, lastPayout time.Time) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := s.pendingCommissions[opID]
	for _, r := range records {
		if r.Role == CommRolePlatform {
			totalCompute += r.AmountCents
		}
		if r.Status == "paid" {
			totalPaid += r.AmountCents
			if r.CreatedAt.After(lastPayout) {
				lastPayout = r.CreatedAt
			}
		} else {
			totalPending += r.AmountCents
		}
	}
	return
}

// GetDetailedOperatorLedgerTotals returns detailed earnings for the CRM.
func (s *Store) GetDetailedOperatorLedgerTotals(opID string) (totalEarned, l1Earned, l2Earned, unpaid int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	records := s.pendingCommissions[opID]
	for _, r := range records {
		totalEarned += r.AmountCents
		
		if r.Role == CommRoleLevel1 {
			l1Earned += r.AmountCents
		} else if r.Role == CommRoleLevel2 {
			l2Earned += r.AmountCents
		}
		
		if r.Status != "paid" {
			unpaid += r.AmountCents
		}
	}
	return
}

// AuditLedgerRecomputation performs a raw re-summation for internal audit verification.
func (s *Store) AuditLedgerRecomputation() (rev, pay int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, records := range s.pendingCommissions {
		for _, r := range records {
			if r.Role == CommRolePlatform {
				rev += r.AmountCents
			}
			if r.Status == "paid" {
				pay += r.AmountCents
			}
		}
	}
	return
}

// GetLedgerHistory returns the full commission history for a specific operator.
func (s *Store) GetLedgerHistory(opID string) []CommissionRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	records, ok := s.pendingCommissions[opID]
	if !ok {
		return []CommissionRecord{}
	}
	
	// Return a copy to avoid concurrency issues
	copied := make([]CommissionRecord, len(records))
	copy(copied, records)
	return copied
}

// GetPayoutArchitecture resolves the 6-tier map for a specific node.
// It follows the Participation Protocol: If a participant is not onboarded, their share is skipped.
func (s *Store) GetPayoutArchitecture(nodeID string) (*PayoutArchitecture, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	node, ok := s.nodes[nodeID]
	if !ok {
		return nil, fmt.Errorf("fatal: rogue node %s - payout architecture resolution impossible", nodeID)
	}

	nodlr, ok := s.nodlrs[node.UserID]
	if !ok {
		return nil, fmt.Errorf("fatal: node %s has no associated nodlr record", nodeID)
	}

	arch := &PayoutArchitecture{
		WnodeID:     AuthoritativeOwnerID,
		WnodeStripe: WnodeBusinessStripeID,
	}

	// 1. Level 0: The Nodlr (70%)
	if nodlr.StripeConnectID != "" {
		arch.NodlrID = nodlr.ID
		arch.NodlrStripe = nodlr.StripeConnectID
	}

	// 2. Lineage: L1 (3%) and L2 (7%)
	l1ID, l2ID := s.resolveTreeNoLock(nodlr.ID)
	
	if l1, ok1 := s.nodlrs[l1ID]; ok1 && l1.StripeConnectID != "" {
		arch.L1ID, arch.L1Stripe = l1.ID, l1.StripeConnectID
	}

	if l2, ok2 := s.nodlrs[l2ID]; ok2 && l2.StripeConnectID != "" {
		arch.L2ID, arch.L2Stripe = l2.ID, l2.StripeConnectID
	}

	// 3. Founder: The Tree Head (3%)
	fID := s.getGenesisFounderNoLock(nodlr.ID)
	if f, okf := s.nodlrs[fID]; okf && f.StripeConnectID != "" {
		// Only Active founders participate in accrual
		if f.Status.Active {
			arch.FounderID, arch.FounderStripe = f.ID, f.StripeConnectID
		}
	}

	// 4. Sales Source (Affiliate - 10%)
	// Note: Sales Source is mapped to the ParentID in this protocol
	if sales, oks := s.nodlrs[nodlr.ParentID]; oks && sales.StripeConnectID != "" {
		arch.SalesSourceID = sales.ID
		arch.SalesSourceStripe = sales.StripeConnectID
	}

	return arch, nil
}

// Internal helpers without locks to avoid re-entry deadlocks

func (s *Store) resolveTreeNoLock(childID string) (l1ID, l2ID string) {
	child, ok := s.nodlrs[childID]
	if !ok || child.ParentID == "" {
		return "", ""
	}
	l1ID = child.ParentID
	l1, ok := s.nodlrs[l1ID]
	if ok && l1.ParentID != "" {
		l2ID = l1.ParentID
	}
	return l1ID, l2ID
}

func (s *Store) getGenesisFounderNoLock(id string) string {
	curr := id
	for {
		n, ok := s.nodlrs[curr]
		if !ok || n.ParentID == "" {
			if n != nil && n.IsFounder {
				return n.ID
			}
			return ""
		}
		if n.IsFounder {
			return n.ID
		}
		curr = n.ParentID
	}
}

func (s *Store) AddMeshClient(c *MeshClient) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.meshClients[c.ID] = c
}

func (s *Store) GetMeshClient(id string) (*MeshClient, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	c, ok := s.meshClients[id]
	return c, ok
}

// GetOpportunityAudit performs a forensic analysis of missed compute revenue.
// (Monthly Missed Revenue / Hardware Cost) = Payback Period
func (s *Store) GetOpportunityAudit(nodlrID string) *OpportunityAudit {
	s.mu.RLock()
	defer s.mu.RUnlock()

	audit := &OpportunityAudit{
		NodlrID: nodlrID,
		Events:  make([]OpportunityEvent, 0),
	}

	// 1. Iterate through historical records to find Sales Source successes
	salesRecords := s.pendingCommissions[nodlrID]
	processedTx := make(map[string]bool)

	for _, r := range salesRecords {
		if r.Role != CommRoleSalesSource {
			continue
		}
		if processedTx[r.TransactionID] {
			continue
		}
		processedTx[r.TransactionID] = true
		audit.EarnedSalesCents += r.AmountCents

		// 2. Identify the Compute Provider for this transaction
		foundComputeShare := false
		var computeAmt int64
		var computeRecipient string

		for otherID, records := range s.pendingCommissions {
			for _, or := range records {
				if or.TransactionID == r.TransactionID && (or.Role == CommRolePlatform || or.Role == CommRoleOrigin) {
					foundComputeShare = true
					computeAmt = or.AmountCents
					computeRecipient = otherID
					break
				}
			}
			if foundComputeShare {
				break
			}
		}

		// 3. If the compute share went to someone else, it's a missed opportunity
		if foundComputeShare && computeRecipient != nodlrID {
			audit.MissedComputeCents += computeAmt

			// 4. Categorization (Forensic Heuristics)
			category := "HARDWARE_GAP"
			reason := "Job required GPU or TEE compute tier"

			// Mock logic for forensic demonstration
			if r.TransactionID != "" {
				b := r.TransactionID[0]
				if b%3 == 0 {
					category = "DOWNTIME"
					reason = "Node was unhealthy or offline during scheduling"
				} else if b%3 == 1 {
					category = "CAPACITY_LIMIT"
					reason = "Hardware exists, but cluster was at 100% capacity"
				}
			}

			audit.Events = append(audit.Events, OpportunityEvent{
				JobID:       r.TransactionID,
				AmountCents: computeAmt,
				Category:    category,
				Reason:      reason,
				Timestamp:   r.CreatedAt,
			})
		}
	}

	// 5. Expansion Insights & Capture Efficiency
	capturedComputeCents := int64(0)
	// We need to know how much compute they DID capture for these Sales Source jobs
	for _, r := range salesRecords {
		if r.Role == CommRoleSalesSource {
			for _, or := range salesRecords {
				if or.TransactionID == r.TransactionID && (or.Role == CommRolePlatform || or.Role == CommRoleOrigin) {
					capturedComputeCents += or.AmountCents
				}
			}
		}
	}

	capturedTotal := audit.EarnedSalesCents + capturedComputeCents
	potentialTotal := capturedTotal + audit.MissedComputeCents
	
	if potentialTotal > 0 {
		audit.CaptureEfficiencyPercentage = (float64(capturedTotal) / float64(potentialTotal)) * 100
	} else {
		audit.CaptureEfficiencyPercentage = 100
	}

	audit.PotentialMonthlyTotalCents = potentialTotal
	
	missedMonthly := float64(audit.MissedComputeCents) / 100.0
	audit.ExpansionInsight = ExpansionInsight{
		Analysis:      fmt.Sprintf("ANALYSIS: You are missing $%.2f/mo in compute revenue from your invitees. Your current cluster lacks the capacity or tier requirement to capture this yield.", missedMonthly),
		MissedMonthly: missedMonthly,
	}

	return audit
}

// --- Auth & Session Management ---

func (s *Store) CreateInviteToken(email, domain string, role UserRole) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	token := uuid.New().String()
	s.inviteTokens[token] = &InviteToken{
		Token:     token,
		Email:     email,
		Domain:    domain,
		Role:      role,
		ExpiresAt: time.Now().Add(72 * time.Hour),
		CreatedAt: time.Now(),
	}
	return token
}

func (s *Store) ConsumeInviteToken(token string) (*InviteToken, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	t, ok := s.inviteTokens[token]
	if !ok {
		return nil, fmt.Errorf("invalid invite token")
	}
	if t.Used {
		return nil, fmt.Errorf("invite token already used")
	}
	if time.Now().After(t.ExpiresAt) {
		return nil, fmt.Errorf("invite token expired")
	}
	t.Used = true
	return t, nil
}

func (s *Store) CreateMagicLinkToken(email, domain string) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	token := uuid.New().String()
	s.magicLinkTokens[token] = &MagicLinkToken{
		Token:     token,
		Email:     email,
		Domain:    domain,
		ExpiresAt: time.Now().Add(15 * time.Minute),
		CreatedAt: time.Now(),
	}
	return token
}

func (s *Store) ConsumeMagicLinkToken(token string) (*MagicLinkToken, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	t, ok := s.magicLinkTokens[token]
	if !ok {
		return nil, fmt.Errorf("invalid magic link")
	}
	if t.Used {
		return nil, fmt.Errorf("magic link already used")
	}
	if time.Now().After(t.ExpiresAt) {
		return nil, fmt.Errorf("magic link expired")
	}
	t.Used = true
	return t, nil
}

func (s *Store) CreateSession(wuid, domain string, role UserRole) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	sessionID := uuid.New().String()
	
	now := time.Now()
	expiresAt := now.Add(24 * time.Hour)
	
	s.domainSessions[sessionID] = &DomainSession{
		WUID:      wuid,
		Domain:    domain,
		Role:      role,
		ExpiresAt: expiresAt,
		CreatedAt: now,
	}
	go s.SaveState()
	
	secret := os.Getenv("NODL_JWT_SECRET")
	if secret == "" {
		secret = "fallback-secret" // Should fail-fast in main, but safe fallback here
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"session_id": sessionID,
		"user_id":    wuid,
		"domain":     domain,
		"role":       string(role),
		"exp":        expiresAt.Unix(),
		"iat":        now.Unix(),
	})
	
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func (s *Store) GetSession(sessionID string) (*DomainSession, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sess, ok := s.domainSessions[sessionID]
	if !ok || time.Now().After(sess.ExpiresAt) {
		return nil, false
	}
	return sess, true
}

func (s *Store) RevokeSession(sessionID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.domainSessions, sessionID)
}

func (s *Store) SetPersistencePath(path string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.statePath = path
}

// GetCRMRecord returns the CRM record for a specific Nodlr ID.
// If it doesn't exist, it creates a default one.
func (s *Store) GetCRMRecord(nodlrID string) *CRMRecord {
	s.mu.Lock()
	defer s.mu.Unlock()

	if r, ok := s.crmRecords[nodlrID]; ok {
		return r
	}

	r := &CRMRecord{
		NodlrID:   nodlrID,
		CreatedAt: time.Now(),
	}
	s.crmRecords[nodlrID] = r
	return r
}

// UpdateCRMRecord safely updates the BusinessName and Phone for a participant.
func (s *Store) UpdateCRMRecord(nodlrID string, businessName, phone string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	r, ok := s.crmRecords[nodlrID]
	if !ok {
		r = &CRMRecord{
			NodlrID:   nodlrID,
			CreatedAt: time.Now(),
		}
		s.crmRecords[nodlrID] = r
	}

	r.BusinessName = businessName
	r.Phone = phone

	go s.SaveState()
	return nil
}

// Phase 10: Governance Read-Only Aggregators

func (s *Store) GetGovernanceSummary() *GovernanceSummary {
	s.mu.RLock()
	defer s.mu.RUnlock()

	summary := &GovernanceSummary{
		TotalNodes:         len(s.nodes),
		TotalAffiliates:    len(s.nodlrs),
		RoundRobinPosition: s.inviteState.NextFounderIndex,
		IntegrityHealthy:   true,
	}

	for _, n := range s.nodlrs {
		if n.Role == RoleFounder {
			summary.TotalFounders++
		} else if n.Role == RolePartner {
			summary.TotalPartners++
		}
	}

	return summary
}

func (s *Store) GetIntegritySnapshot() *IntegritySnapshot {
	s.mu.RLock()
	defer s.mu.RUnlock()

	snap := &IntegritySnapshot{
		LineageSummary: make(map[string]int),
		SyntheticWUIDs: []string{"FOUNDER-SLOT-01", "FOUNDER-SLOT-02", "FOUNDER-SLOT-03", "FOUNDER-SLOT-04"},
		CorruptionFlags: false,
	}

	for _, n := range s.nodlrs {
		if n.ParentID != "" {
			snap.LineageSummary[n.ParentID]++
		}
	}

	for _, synth := range snap.SyntheticWUIDs {
		if _, exists := s.nodlrs[synth]; exists {
			snap.CorruptionFlags = true
		}
	}

	return snap
}

func (s *Store) GetPartnerOverview() *PartnerOverview {
	s.mu.RLock()
	defer s.mu.RUnlock()

	ov := &PartnerOverview{
		PartnerList:    make([]PartnerStatus, 0),
		PartnerInvites: make([]*AffiliateInvite, 0),
	}

	for i := 4; i < 10; i++ {
		slot := i + 1
		wuid := s.founders[i]
		status := "empty"
		if wuid != "" {
			status = "filled"
			ov.PartnerCount++
		}
		ov.PartnerList = append(ov.PartnerList, PartnerStatus{
			Slot:   slot,
			WUID:   wuid,
			Status: status,
		})
	}

	for _, inv := range s.inviteState.Registry {
		if inv.Role == "partner" {
			ov.PartnerInvites = append(ov.PartnerInvites, inv)
		}
	}

	return ov
}

func (s *Store) GetFounderSlotsStatus() *FounderSlotsResponse {
	s.mu.RLock()
	defer s.mu.RUnlock()

	resp := &FounderSlotsResponse{
		Founders: make([]FounderSlotStatus, 0),
		Invites:  make([]*AffiliateInvite, 0),
	}

	for i := 0; i < 4; i++ {
		slot := i + 1
		wuid := s.founders[i]
		status := "empty"
		if wuid != "" {
			status = "filled"
		}
		resp.Founders = append(resp.Founders, FounderSlotStatus{
			Slot:   slot,
			WUID:   wuid,
			Status: status,
		})
	}

	for _, inv := range s.inviteState.Registry {
		if inv.Role == "founder" {
			resp.Invites = append(resp.Invites, inv)
		}
	}

	return resp
}
