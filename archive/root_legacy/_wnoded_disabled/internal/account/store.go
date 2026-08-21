package account

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store struct {
	mu                sync.RWMutex
	nodlrs            map[string]*Nodlr
	founders          [5]string // IDs mapping to Founder #1..#5
	organicCount      int       // For round-robin placement
	pendingCommissions map[string][]CommissionRecord // NodlrID -> Records
	computeLedger      []ComputeRecord
	payoutLedger       []PayoutRecord
	statePath          string

	// Mesh Client ID Generation State
	meshBucket         int
	meshSequence       int
	meshMonthYear      string
}

type storeState struct {
	OrganicCount  int    `json:"organic_count"`
	MeshBucket    int    `json:"mesh_bucket"`
	MeshSequence  int    `json:"mesh_sequence"`
	MeshMonthYear string `json:"mesh_month_year"`
}

func NewStore(statePath string) *Store {
	s := &Store{
		nodlrs:             make(map[string]*Nodlr),
		pendingCommissions: make(map[string][]CommissionRecord),
		statePath:          statePath,
	}
	s.loadState()
	return s
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

// SetFounder assigns a specific ID to one of the 5 founder slots.
func (s *Store) SetFounder(index int, id string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if index < 1 || index > 5 {
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

	id := uuid.New().String()
	
	// Round-robin for organic signups (Strict Genesis Rotation)
	if parentID == "" {
		slotIndex := s.organicCount % 5
		parentID = s.founders[slotIndex]
		s.organicCount++
	}

	nodlrID := s.generateNodlrID()
	meshClientID := s.GenerateMeshClientID()

	n := &Nodlr{
		ID:              id,
		NodlrID:         nodlrID,
		MeshClientID:    meshClientID,
		Email:           email,
		Status:          "pending_stripe",
		PayoutFrequency: PayoutDaily,
		PayoutStatus:    PayoutStatusPending,
		IntegrityScore:  600, // Initial trust
		ParentID:        parentID,
		Nodes:           []string{},
		Affiliates:      []string{},
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
	s.saveState() // Save state after incrementing counters
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

	id := fmt.Sprintf("M%d-%06d-%s", s.meshBucket, s.meshSequence, s.meshMonthYear)
	s.saveState()
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

func (s *Store) generateNodlrID() string {
	seq := 100001 + len(s.nodlrs)
	date := time.Now().Format("0102")
	level := "01"
	chars := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	suffix := string([]byte{chars[rand.Intn(len(chars))], chars[rand.Intn(len(chars))]})
	
	return fmt.Sprintf("%d-%s-%s-%s", seq, date, level, suffix)
}

func (s *Store) AddNodlr(n *Nodlr) {
	s.mu.Lock()
	defer s.mu.Unlock()
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

// TransferAffiliate reassigns a child to a new parent. Irreversible.
func (s *Store) TransferAffiliate(childID, newParentID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	child, ok := s.nodlrs[childID]
	if !ok {
		return nil // or error
	}
	
	// Safety: check if newParent exists
	if _, ok := s.nodlrs[newParentID]; !ok {
		return nil
	}

	child.ParentID = newParentID
	return nil
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
	}
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

// AddComputeRecord records earnings from compute.
func (s *Store) AddComputeRecord(opID string, amount int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.computeLedger = append(s.computeLedger, ComputeRecord{
		OperatorID: opID,
		Amount:     amount,
		Timestamp:  time.Now(),
	})
}

// AddPayoutRecord records a payout event.
func (s *Store) AddPayoutRecord(opID string, amount int64, stripeTransferID, status string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.payoutLedger = append(s.payoutLedger, PayoutRecord{
		OperatorID:       opID,
		Amount:           amount,
		StripeTransferID: stripeTransferID,
		Status:           status,
		Timestamp:        time.Now(),
	})
}

// UpdatePayoutRecordStatus updates the status of a payout by its Stripe Transfer ID.
func (s *Store) UpdatePayoutRecordStatus(stripeTransferID, status string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i, r := range s.payoutLedger {
		if r.StripeTransferID == stripeTransferID {
			s.payoutLedger[i].Status = status
			break
		}
	}
}

// GetOperatorSummary calculates the financial summary for an operator.
func (s *Store) GetOperatorSummary(email string) (*OperatorSummary, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var op *Nodlr
	for _, n := range s.nodlrs {
		if n.Email == email {
			op = n
			break
		}
	}

	if op == nil {
		return nil, nil // or error
	}

	summary := &OperatorSummary{
		StripeAccountID: op.StripeAccountID,
		PayoutStatus:    string(op.PayoutStatus),
	}

	for _, r := range s.computeLedger {
		if r.OperatorID == op.ID {
			summary.TotalCompute += r.Amount
		}
	}

	for _, r := range s.payoutLedger {
		if r.OperatorID == op.ID {
			if r.Status == "paid" {
				summary.TotalPaid += r.Amount
			} else if r.Status == "pending" {
				summary.TotalPending += r.Amount
			}
			if r.Timestamp.After(summary.LastPayout) {
				summary.LastPayout = r.Timestamp
			}
		}
	}

	return summary, nil
}

// GetGlobalLedgerStats returns platform-wide aggregated financials.
func (s *Store) GetGlobalLedgerStats() (totalCompute, totalPaid, totalPending int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, r := range s.computeLedger {
		totalCompute += r.Amount
	}

	for _, r := range s.payoutLedger {
		if r.Status == "paid" {
			totalPaid += r.Amount
		} else {
			totalPending += r.Amount
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
	for _, r := range s.computeLedger {
		if r.Timestamp.After(cutoff) {
			total += r.Amount
		}
	}
	return total
}

// GetOperatorLedgerTotals returns aggregated financials for a single operator.
func (s *Store) GetOperatorLedgerTotals(opID string) (totalCompute, totalPaid, totalPending int64, lastPayout time.Time) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, r := range s.computeLedger {
		if r.OperatorID == opID {
			totalCompute += r.Amount
		}
	}

	for _, r := range s.payoutLedger {
		if r.OperatorID == opID {
			if r.Status == "paid" {
				totalPaid += r.Amount
			} else {
				totalPending += r.Amount
			}
			if r.Timestamp.After(lastPayout) {
				lastPayout = r.Timestamp
			}
		}
	}
	return
}
// GetOpportunityAudit returns a diagnostic revenue matrix for a given user.
func (s *Store) GetOpportunityAudit(nodlrIdOrUuid string) any {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Find the account
	var target *Nodlr
	for _, n := range s.nodlrs {
		if n.ID == nodlrIdOrUuid || n.NodlrID == nodlrIdOrUuid {
			target = n
			break
		}
	}

	if target == nil {
		// Return a zero-state audit for safety
		return map[string]any{
			"nodlrId": "M0-000000-0000",
			"earnedSalesCents": 0,
			"missedComputeCents": 0,
			"captureEfficiencyPercentage": 0,
			"potentialMonthlyTotalCents": 0,
			"events": []any{},
			"expansionInsight": map[string]any{
				"analysis": "Identity mismatch. Please verify your Nodlr session.",
				"missedMonthly": 0,
			},
		}
	}

	// Mock Logic for Ambassador Intelligence (Dev Parity)
	earned := s.GetPendingTotal(target.ID)
	missed := int64(145000) // Mock 1.4k missed potential for UI feedback
	efficiency := 78.5
	if earned > 0 {
		efficiency = float64(earned) / float64(earned+missed) * 100
	}

	return map[string]any{
		"nodlrId": target.NodlrID,
		"earnedSalesCents": earned,
		"missedComputeCents": missed,
		"captureEfficiencyPercentage": efficiency,
		"potentialMonthlyTotalCents": earned + missed + 50000,
		"events": []map[string]any{
			{
				"jobId": "J-8821-X",
				"amountCents": 450,
				"category": "L1 Affiliate",
				"reason": "Hardware node 'Alpha-1' processed 1.2TB",
				"timestamp": time.Now().Add(-2 * time.Hour).Format(time.RFC3339),
			},
			{
				"jobId": "J-8824-Y",
				"amountCents": 1200,
				"category": "Sales Source",
				"reason": "Direct mesh client acquisition: 'Quantum-Ops'",
				"timestamp": time.Now().Add(-5 * time.Hour).Format(time.RFC3339),
			},
		},
		"expansionInsight": map[string]any{
			"analysis": "Expansion potential: Your L1 network is operating at 62% hardware capacity. Activating 3 additional nodes would bridge the $1,450 missed revenue gap.",
			"missedMonthly": 145000,
		},
	}
}
