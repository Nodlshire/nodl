package pricing

import (
	"context"
	"crypto/ed25519"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/dewi"
	"go.uber.org/zap"
)

// Base protocol micro-rate schedule (USD per byte processed)
var protocolBaseRates = map[string]float64{
	"RNS/LXMF":       0.0000010, // $0.001 per KB
	"Meshtastic":     0.0000005, // $0.0005 per KB
	"Semtech/LoRaWAN": 0.0000020, // $0.002 per KB
	"AX25/APRS":      0.0000003, // $0.0003 per KB
}

// FlowThroughEngine processes DeWi PacketDeliveryProofs and emits settlement records.
type FlowThroughEngine struct {
	mu           sync.RWMutex
	log          *zap.Logger
	store        *Store
	operatorKeys map[string]ed25519.PublicKey
	processedIDs map[string]bool // Idempotency filter: proofID -> bool
	settlements  []dewi.SettlementResult
}

// NewFlowThroughEngine creates a new FlowThroughEngine.
func NewFlowThroughEngine(store *Store, log *zap.Logger) *FlowThroughEngine {
	return &FlowThroughEngine{
		store:        store,
		log:          log,
		operatorKeys: make(map[string]ed25519.PublicKey),
		processedIDs: make(map[string]bool),
		settlements:  make([]dewi.SettlementResult, 0),
	}
}

// RegisterOperatorKey registers a known operator's public key for proof verification.
func (f *FlowThroughEngine) RegisterOperatorKey(operatorID string, pubKey ed25519.PublicKey) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.operatorKeys[operatorID] = pubKey
}

// AcceptProof verifies a PacketDeliveryProof, calculates 70/20/10 USD splits, and emits a SettlementResult.
func (f *FlowThroughEngine) AcceptProof(ctx context.Context, proof dewi.PacketDeliveryProof) (dewi.SettlementResult, error) {
	f.mu.Lock()
	defer f.mu.Unlock()

	// 1. Idempotency Check
	if f.processedIDs[proof.ProofID] {
		return dewi.SettlementResult{}, fmt.Errorf("proof ID %s already processed (replay ignored)", proof.ProofID)
	}

	// 2. Verify Signature if operator key is registered
	if pubKey, ok := f.operatorKeys[proof.OperatorID]; ok {
		valid, err := proof.Verify(pubKey)
		if err != nil || !valid {
			return dewi.SettlementResult{}, fmt.Errorf("proof signature verification failed for operator %s", proof.OperatorID)
		}
	}

	// 3. Compute Gross USD Amount
	baseRate, ok := protocolBaseRates[proof.Protocol]
	if !ok {
		baseRate = 0.0000005 // Fallback default rate
	}

	grossUSD := float64(proof.PayloadSize) * baseRate
	if proof.ProcessingCost > 0 {
		grossUSD = proof.ProcessingCost
	}

	// 4. Calculate Authoritative 6-Tier Revenue Split (100.0% Total)
	nodlrShare := grossUSD * 0.70          // 70% Nodlr (Node Operator)
	salesSourceShare := grossUSD * 0.10    // 10% Sales Source Commission
	affiliateL1Share := grossUSD * 0.03    // 3% Affiliate Level 1
	affiliateL2Share := grossUSD * 0.07    // 7% Affiliate Level 2
	stewardFeeShare := grossUSD * 0.07     // 7% Steward Fee (Treasury & Operations)
	founderShare := grossUSD * 0.03        // 3% Founder Lifelong Affiliate Commission (100001-0426-01-AA)

	settlement := dewi.SettlementResult{
		SettlementID:     "stl-" + uuid.New().String()[:8],
		ProofID:          proof.ProofID,
		OperatorShareUSD: nodlrShare,
		PlatformShareUSD: stewardFeeShare,
		AffiliateShareUSD: affiliateL1Share + affiliateL2Share + salesSourceShare + founderShare,
		Timestamp:        time.Now().UTC(),
	}

	// 5. Mark processed and store record
	f.processedIDs[proof.ProofID] = true
	f.settlements = append(f.settlements, settlement)

	// Keep max 5000 recent settlements in memory
	if len(f.settlements) > 5000 {
		f.settlements = f.settlements[len(f.settlements)-5000:]
	}

	f.log.Info("settled DeWi packet proof with 6-tier revenue distribution",
		zap.String("proofId", proof.ProofID),
		zap.String("protocol", proof.Protocol),
		zap.Float64("nodlrUSD", nodlrShare),
		zap.Float64("salesSourceUSD", salesSourceShare),
		zap.Float64("affiliateL1USD", affiliateL1Share),
		zap.Float64("affiliateL2USD", affiliateL2Share),
		zap.Float64("stewardFeeUSD", stewardFeeShare),
		zap.Float64("founderUSD", founderShare),
	)

	return settlement, nil
}

// AcceptTransmissionRecord processes an outbound TransmissionRecord and records TX settlement.
func (f *FlowThroughEngine) AcceptTransmissionRecord(ctx context.Context, tx dewi.TransmissionRecord) (dewi.SettlementResult, error) {
	f.mu.Lock()
	defer f.mu.Unlock()

	if f.processedIDs[tx.TxID] {
		return dewi.SettlementResult{}, fmt.Errorf("transmission ID %s already processed (replay ignored)", tx.TxID)
	}

	if pubKey, ok := f.operatorKeys[tx.OperatorID]; ok {
		valid, err := tx.Verify(pubKey)
		if err != nil || !valid {
			return dewi.SettlementResult{}, fmt.Errorf("transmission signature verification failed for operator %s", tx.OperatorID)
		}
	}

	baseRate, ok := protocolBaseRates[tx.Protocol]
	if !ok {
		baseRate = 0.0000005
	}
	grossUSD := float64(tx.PayloadSize) * baseRate * 1.5 // 1.5x TX multiplier for RF resource usage
	if tx.TxCostUSD > 0 {
		grossUSD = tx.TxCostUSD
	}

	operatorShare := grossUSD * 0.70
	platformShare := grossUSD * 0.20
	affiliateShare := grossUSD * 0.10

	settlement := dewi.SettlementResult{
		SettlementID:      "tx-stl-" + uuid.New().String()[:8],
		ProofID:           tx.TxID,
		OperatorShareUSD:  operatorShare,
		PlatformShareUSD:  platformShare,
		AffiliateShareUSD: affiliateShare,
		Timestamp:         time.Now().UTC(),
	}

	f.processedIDs[tx.TxID] = true
	f.settlements = append(f.settlements, settlement)

	f.log.Info("settled DeWi TX transmission",
		zap.String("txId", tx.TxID),
		zap.String("protocol", tx.Protocol),
		zap.Float64("operatorUSD", operatorShare),
	)

	return settlement, nil
}

// GetRecentSettlements returns recent settlement records.
func (f *FlowThroughEngine) GetRecentSettlements(limit int) []dewi.SettlementResult {
	f.mu.RLock()
	defer f.mu.RUnlock()

	if limit <= 0 || limit > len(f.settlements) {
		limit = len(f.settlements)
	}
	start := len(f.settlements) - limit
	res := make([]dewi.SettlementResult, limit)
	copy(res, f.settlements[start:])
	return res
}
