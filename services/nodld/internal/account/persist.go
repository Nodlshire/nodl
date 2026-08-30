package account

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync/atomic"
	"time"
)

// AuthState captures the entire authoritative ledger and balances.
type AuthState struct {
	Nodlrs             map[string]*Nodlr              `json:"nodlrs"`
	PendingCommissions map[string][]CommissionRecord `json:"pending_commissions"`
	OrganicCount       int                            `json:"organic_count"`
	MeshBucket         int                            `json:"mesh_bucket"`
	MeshSequence       int                            `json:"mesh_sequence"`
	MeshMonthYear      string                         `json:"mesh_month_year"`
	CRMRecords         map[string]*CRMRecord          `json:"crm_records"`
	Nodes              map[string]*WnodeNode          `json:"nodes,omitempty"`
	OperatorEarnings   []*OperatorEarnings            `json:"operator_earnings,omitempty"`
	OperatorPayouts    []*OperatorPayout              `json:"operator_payouts,omitempty"`
	TokenLedger        []*TokenLedgerEntry            `json:"token_ledger,omitempty"`
	TokenBalances      map[string]*TokenBalance       `json:"token_balances,omitempty"`
	OperatorStakes     map[string]*OperatorStake      `json:"operator_stakes,omitempty"`
	StakeLedger        []*StakeLedger                 `json:"stake_ledger,omitempty"`
	OperatorReputations map[string]*OperatorReputation `json:"operator_reputations,omitempty"`
	ReputationLedger    []*ReputationLedger            `json:"reputation_ledger,omitempty"`
	OperatorIdentities  map[string]*OperatorIdentity   `json:"operator_identities,omitempty"`
	IdentityLedger      []*IdentityLedgerEntry         `json:"identity_ledger,omitempty"`
	Invite              *InviteState                   `json:"invite,omitempty"`
	Founders            map[string]string              `json:"founders,omitempty"`
	Integrations        map[string]*Integration        `json:"integrations,omitempty"`
	DomainSessions      map[string]*DomainSession      `json:"domain_sessions,omitempty"`
	HeadlessTokens      map[string]*HeadlessToken      `json:"headless_tokens,omitempty"`
	InviteTokens        map[string]*InviteToken        `json:"invite_tokens,omitempty"`
	Souls               map[string]*SoulRecord         `json:"souls,omitempty"`
}

func (s *Store) SaveState() error {
	batch := atomic.LoadInt64(&s.saveBatch)

	s.saveMu.Lock()
	defer s.saveMu.Unlock()

	// If a save was already executed that included our request, skip writing
	if atomic.LoadInt64(&s.saveBatch) > batch {
		return nil
	}

	// Debounce period: 100ms
	elapsed := time.Since(s.lastSave)
	if elapsed < 100*time.Millisecond {
		time.Sleep(100*time.Millisecond - elapsed)
	}

	s.mu.RLock()
	if s.statePath == "" {
		s.mu.RUnlock()
		return nil
	}

	foundersMap := make(map[string]string)
	for i := 0; i < 10; i++ {
		if s.founders[i] != "" {
			foundersMap[fmt.Sprintf("%d", i+1)] = s.founders[i]
		}
	}

	state := AuthState{
		Nodlrs:             s.nodlrs,
		PendingCommissions: s.pendingCommissions,
		OrganicCount:       s.organicCount,
		MeshBucket:         s.meshBucket,
		MeshSequence:       s.meshSequence,
		MeshMonthYear:      s.meshMonthYear,
		CRMRecords:         s.crmRecords,
		Nodes:              s.nodes,
		OperatorEarnings:   s.operatorEarnings,
		OperatorPayouts:    s.operatorPayouts,
		TokenLedger:        s.tokenLedger,
		TokenBalances:      s.tokenBalances,
		OperatorStakes:     s.operatorStakes,
		StakeLedger:        s.stakeLedger,
		OperatorReputations: s.operatorReputations,
		ReputationLedger:    s.reputationLedger,
		OperatorIdentities:  s.operatorIdentities,
		IdentityLedger:      s.identityLedger,
		Invite:              s.inviteState,
		Founders:            foundersMap,
		Integrations:        s.integrations,
		DomainSessions:      s.domainSessions,
		HeadlessTokens:      s.headlessTokens,
		InviteTokens:        s.inviteTokens,
		Souls:               s.souls,
	}

	data, err := json.MarshalIndent(state, "", "  ")
	s.mu.RUnlock()

	if err != nil {
		return err
	}

	if err := os.MkdirAll(filepath.Dir(s.statePath), 0755); err != nil {
		return err
	}

	tmpPath := s.statePath + ".tmp"
	if err := os.WriteFile(tmpPath, data, 0644); err != nil {
		return err
	}
	err = os.Rename(tmpPath, s.statePath)
	s.lastSave = time.Now()
	atomic.AddInt64(&s.saveBatch, 1)
	return err
}

func (s *Store) LoadState() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.statePath == "" {
		return nil
	}

	data, err := os.ReadFile(s.statePath)
	if err != nil {
		return err
	}

	var state AuthState
	if err := json.Unmarshal(data, &state); err != nil {
		return err
	}

	if state.Nodlrs != nil {
		for k, v := range state.Nodlrs {
			s.nodlrs[k] = v
		}
	}

	if state.PendingCommissions != nil {
		s.pendingCommissions = make(map[string][]CommissionRecord)
		for rid, records := range state.PendingCommissions {
			if _, ok := s.nodlrs[rid]; !ok {
				fmt.Printf("[RECOVERY] skipped orphaned records for %s\n", rid)
				continue
			}
			s.pendingCommissions[rid] = records
		}
	}

	// Recovery: Recompute PendingBalanceCents from ledger if sum mismatch
	for id, n := range s.nodlrs {
		var sum int64
		for _, r := range s.pendingCommissions[id] {
			if r.Status == "pending" {
				sum += r.AmountCents
			}
		}
		if sum != n.PendingBalanceCents {
			fmt.Printf("[RECOVERY] auto-recovered pending balance for %s: %d -> %d\n", id, n.PendingBalanceCents, sum)
			n.PendingBalanceCents = sum
		}
	}
	s.organicCount = state.OrganicCount
	s.meshBucket = state.MeshBucket
	s.meshSequence = state.MeshSequence
	s.meshMonthYear = state.MeshMonthYear
	if state.CRMRecords != nil {
		for k, v := range state.CRMRecords {
			s.crmRecords[k] = v
		}
	}
	if state.Nodes != nil {
		s.nodes = state.Nodes
	}
	if s.nodes == nil {
		s.nodes = make(map[string]*WnodeNode)
	}
	if state.Integrations != nil {
		s.integrations = state.Integrations
	} else {
		s.integrations = make(map[string]*Integration)
	}
	if state.DomainSessions != nil {
		s.domainSessions = state.DomainSessions
	}
	if state.OperatorEarnings != nil {
		s.operatorEarnings = state.OperatorEarnings
	}
	if state.OperatorPayouts != nil {
		s.operatorPayouts = state.OperatorPayouts
	}
	if state.TokenLedger != nil {
		s.tokenLedger = state.TokenLedger
	}
	if state.TokenBalances != nil {
		s.tokenBalances = state.TokenBalances
	}
	if s.tokenBalances == nil {
		s.tokenBalances = make(map[string]*TokenBalance)
	}
	if state.OperatorStakes != nil {
		s.operatorStakes = state.OperatorStakes
	}
	if s.operatorStakes == nil {
		s.operatorStakes = make(map[string]*OperatorStake)
	}
	if state.StakeLedger != nil {
		s.stakeLedger = state.StakeLedger
	}
	if s.stakeLedger == nil {
		s.stakeLedger = make([]*StakeLedger, 0)
	}
	if state.OperatorReputations != nil {
		s.operatorReputations = state.OperatorReputations
	}
	if s.operatorReputations == nil {
		s.operatorReputations = make(map[string]*OperatorReputation)
	}
	if state.ReputationLedger != nil {
		s.reputationLedger = state.ReputationLedger
	}
	if s.reputationLedger == nil {
		s.reputationLedger = make([]*ReputationLedger, 0)
	}
	if state.OperatorIdentities != nil {
		s.operatorIdentities = state.OperatorIdentities
	}
	if s.operatorIdentities == nil {
		s.operatorIdentities = make(map[string]*OperatorIdentity)
	}
	if state.IdentityLedger != nil {
		s.identityLedger = state.IdentityLedger
	}
	if s.identityLedger == nil {
		s.identityLedger = make([]*IdentityLedgerEntry, 0)
	}
	if state.InviteTokens != nil {
		s.inviteTokens = state.InviteTokens
	}
	if s.inviteTokens == nil {
		s.inviteTokens = make(map[string]*InviteToken)
	}
	if state.Souls != nil {
		s.souls = state.Souls
	}
	if s.souls == nil {
		s.souls = make(map[string]*SoulRecord)
	}
	if state.Invite != nil {
		s.inviteState = state.Invite
	}
	if s.inviteState == nil {
		s.initInviteState()
	}

	if state.Founders != nil {
		for i := 0; i < 10; i++ {
			if val, ok := state.Founders[fmt.Sprintf("%d", i+1)]; ok {
				s.founders[i] = val
			}
		}
	}
	
	if state.HeadlessTokens != nil {
		now := time.Now()
		for k, t := range state.HeadlessTokens {
			if !now.After(t.ExpiresAt) {
				s.headlessTokens[k] = t
			}
		}
	}

	// Migration Hook: Scrub "Test User" mock data from persistent state
	// Invariant: Never delete any identity that exists in any genuine SoT registry (cross-check rule).
	// We only purge records that are provably synthetic mocks.
	mockID := "100002-0426-01-AA"
	isGenuine := false
	if s.meshClients != nil {
		if _, exists := s.meshClients[mockID]; exists {
			isGenuine = true
		}
	}
	// Add other cross-checks here if needed (e.g. check nodes)

	if !isGenuine {
		if s.nodlrs != nil {
			delete(s.nodlrs, mockID)
		}
		if s.crmRecords != nil {
			delete(s.crmRecords, mockID)
		}
	}

	s.mu.Unlock()
	s.SeedFoundationIdentities()
	s.SeedGlobalMeshNodes()
	s.SanitizeAllStateInvariants()
	s.mu.Lock()

	return nil
}
