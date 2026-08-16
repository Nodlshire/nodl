package dewi

import (
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

// ProofLineageTracker maintains the rolling cryptographic hash chain for all DeWi proofs.
type ProofLineageTracker struct {
	mu              sync.Mutex
	lastProofID     string
	currentDepth    int64
	lastLineageHash string
}

var globalLineage = &ProofLineageTracker{
	lastProofID:     "00000000-0000-0000-0000-000000000000",
	currentDepth:    0,
	lastLineageHash: "0000000000000000000000000000000000000000000000000000000000000000",
}

// NextLineage returns the previous proof ID, new depth, and computes the rolling lineage hash.
func (plt *ProofLineageTracker) NextLineage(newProofID string) (prevID string, depth int64, lineageHash string) {
	plt.mu.Lock()
	defer plt.mu.Unlock()

	prevID = plt.lastProofID
	plt.currentDepth++
	depth = plt.currentDepth

	raw := fmt.Sprintf("%s:%s:%d:%s", prevID, newProofID, depth, plt.lastLineageHash)
	h := sha256.Sum256([]byte(raw))
	lineageHash = hex.EncodeToString(h[:])

	plt.lastProofID = newProofID
	plt.lastLineageHash = lineageHash
	return prevID, depth, lineageHash
}

// PacketDeliveryProof is the canonical telemetry record with proof-chaining capabilities.
type PacketDeliveryProof struct {
	ProofID         string            `json:"proofId"`        // UUID v4
	OperatorID      string            `json:"operatorId"`     // Wnode operator identifier
	AdapterName     string            `json:"adapterName"`    // e.g., "reticulum", "meshtastic"
	Protocol        string            `json:"protocol"`       // e.g., "RNS/LXMF", "Meshtastic", "Semtech", "AX25"
	RouteID         string            `json:"routeId"`        // internal route or destination identifier
	PayloadHash     string            `json:"payloadHash"`    // SHA256 hex of payload
	PayloadSize     int               `json:"payloadSize"`    // bytes
	Timestamp       time.Time         `json:"timestamp"`      // UTC
	LocalNonce      string            `json:"localNonce"`     // monotonic counter for replay protection
	ProofSignature  string            `json:"proofSignature"` // Ed25519 signature of canonical bytes
	ProcessingCost  float64           `json:"processingCost"` // estimated USD cost (optional)
	PreviousProofID string            `json:"previousProofId"`// Rolling hash chain previous proof ID
	LineageDepth    int64             `json:"lineageDepth"`   // Monotonic chain depth
	LineageHash     string            `json:"lineageHash"`    // SHA256 rolling lineage chain hash
	Metadata        map[string]string `json:"metadata"`       // protocol-specific (rssi, snr, gateway_id, etc.)
}

// TransmissionRecord represents an audited, signed TX receipt for outward transmissions.
type TransmissionRecord struct {
	TxID            string            `json:"txId"`           // UUID v4
	OperatorID      string            `json:"operatorId"`     // Wnode operator identifier
	AdapterName     string            `json:"adapterName"`    // e.g., "reticulum", "meshtastic"
	Protocol        string            `json:"protocol"`       // e.g., "RNS/LXMF", "Meshtastic", "Semtech", "AX25"
	Destination     string            `json:"destination"`    // target address / destination
	PayloadHash     string            `json:"payloadHash"`    // SHA256 hex of payload
	PayloadSize     int               `json:"payloadSize"`    // bytes
	Timestamp       time.Time         `json:"timestamp"`      // UTC
	TxCostUSD       float64           `json:"txCostUsd"`      // estimated USD cost charged for transmission
	TxSignature     string            `json:"txSignature"`    // Ed25519 signature of canonical TX bytes
	ApprovalString  string            `json:"approvalString"` // operator approval string reference
	PreviousProofID string            `json:"previousProofId"`
	LineageDepth    int64             `json:"lineageDepth"`
	LineageHash     string            `json:"lineageHash"`
	Metadata        map[string]string `json:"metadata"`
}

// NewTransmissionRecord creates a new TransmissionRecord for an outgoing packet with lineage chaining.
func NewTransmissionRecord(operatorID, adapterName, protocol, destination string, payload []byte, approvalStr string) TransmissionRecord {
	hash := sha256.Sum256(payload)
	txID := uuid.New().String()
	prevID, depth, linHash := globalLineage.NextLineage(txID)

	return TransmissionRecord{
		TxID:            txID,
		OperatorID:      operatorID,
		AdapterName:     adapterName,
		Protocol:        protocol,
		Destination:     destination,
		PayloadHash:     hex.EncodeToString(hash[:]),
		PayloadSize:     len(payload),
		Timestamp:       time.Now().UTC(),
		ApprovalString:  approvalStr,
		PreviousProofID: prevID,
		LineageDepth:    depth,
		LineageHash:     linHash,
		Metadata:        make(map[string]string),
	}
}

// CanonicalBytes returns deterministic JSON serialization of the transmission record for signing.
func (t *TransmissionRecord) CanonicalBytes() ([]byte, error) {
	canonical := map[string]interface{}{
		"approvalString":  t.ApprovalString,
		"adapterName":     t.AdapterName,
		"destination":     t.Destination,
		"lineageDepth":    t.LineageDepth,
		"lineageHash":     t.LineageHash,
		"operatorId":      t.OperatorID,
		"payloadHash":     t.PayloadHash,
		"payloadSize":     t.PayloadSize,
		"previousProofId": t.PreviousProofID,
		"protocol":        t.Protocol,
		"timestamp":       t.Timestamp.Format(time.RFC3339Nano),
		"txCostUsd":       t.TxCostUSD,
		"txId":            t.TxID,
	}

	keys := make([]string, 0, len(canonical))
	for k := range canonical {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	ordered := make([]byte, 0, 512)
	ordered = append(ordered, '{')
	for i, k := range keys {
		if i > 0 {
			ordered = append(ordered, ',')
		}
		keyBytes, _ := json.Marshal(k)
		valBytes, _ := json.Marshal(canonical[k])
		ordered = append(ordered, keyBytes...)
		ordered = append(ordered, ':')
		ordered = append(ordered, valBytes...)
	}
	ordered = append(ordered, '}')

	return ordered, nil
}

// Sign signs the transmission record with the operator Ed25519 private key.
func (t *TransmissionRecord) Sign(privKey ed25519.PrivateKey) error {
	canonical, err := t.CanonicalBytes()
	if err != nil {
		return fmt.Errorf("canonical serialization failed: %w", err)
	}
	sig := ed25519.Sign(privKey, canonical)
	t.TxSignature = hex.EncodeToString(sig)
	return nil
}

// Verify verifies the transmission record signature against the operator public key.
func (t *TransmissionRecord) Verify(pubKey ed25519.PublicKey) (bool, error) {
	canonical, err := t.CanonicalBytes()
	if err != nil {
		return false, fmt.Errorf("canonical serialization failed: %w", err)
	}
	sig, err := hex.DecodeString(t.TxSignature)
	if err != nil {
		return false, fmt.Errorf("invalid signature hex: %w", err)
	}
	return ed25519.Verify(pubKey, canonical, sig), nil
}

// NewProof creates a new PacketDeliveryProof with lineage chaining.
func NewProof(operatorID, adapterName, protocol, routeID string, payload []byte, nonce string) PacketDeliveryProof {
	hash := sha256.Sum256(payload)
	proofID := uuid.New().String()
	prevID, depth, linHash := globalLineage.NextLineage(proofID)

	return PacketDeliveryProof{
		ProofID:         proofID,
		OperatorID:      operatorID,
		AdapterName:     adapterName,
		Protocol:        protocol,
		RouteID:         routeID,
		PayloadHash:     hex.EncodeToString(hash[:]),
		PayloadSize:     len(payload),
		Timestamp:       time.Now().UTC(),
		LocalNonce:      nonce,
		PreviousProofID: prevID,
		LineageDepth:    depth,
		LineageHash:     linHash,
		Metadata:        make(map[string]string),
	}
}

// CanonicalBytes returns the deterministic JSON serialization of the proof.
func (p *PacketDeliveryProof) CanonicalBytes() ([]byte, error) {
	canonical := map[string]interface{}{
		"adapterName":     p.AdapterName,
		"lineageDepth":    p.LineageDepth,
		"lineageHash":     p.LineageHash,
		"localNonce":      p.LocalNonce,
		"operatorId":      p.OperatorID,
		"payloadHash":     p.PayloadHash,
		"payloadSize":     p.PayloadSize,
		"previousProofId": p.PreviousProofID,
		"processingCost": p.ProcessingCost,
		"proofId":         p.ProofID,
		"protocol":        p.Protocol,
		"routeId":         p.RouteID,
		"timestamp":       p.Timestamp.Format(time.RFC3339Nano),
	}

	if len(p.Metadata) > 0 {
		keys := make([]string, 0, len(p.Metadata))
		for k := range p.Metadata {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		sortedMeta := make([]map[string]string, 0, len(keys))
		for _, k := range keys {
			sortedMeta = append(sortedMeta, map[string]string{k: p.Metadata[k]})
		}
		canonical["metadata"] = sortedMeta
	}

	topKeys := make([]string, 0, len(canonical))
	for k := range canonical {
		topKeys = append(topKeys, k)
	}
	sort.Strings(topKeys)

	ordered := make([]byte, 0, 512)
	ordered = append(ordered, '{')
	for i, k := range topKeys {
		if i > 0 {
			ordered = append(ordered, ',')
		}
		keyBytes, _ := json.Marshal(k)
		valBytes, _ := json.Marshal(canonical[k])
		ordered = append(ordered, keyBytes...)
		ordered = append(ordered, ':')
		ordered = append(ordered, valBytes...)
	}
	ordered = append(ordered, '}')

	return ordered, nil
}

// Sign signs the proof's canonical bytes with the given Ed25519 private key.
func (p *PacketDeliveryProof) Sign(privKey ed25519.PrivateKey) error {
	canonical, err := p.CanonicalBytes()
	if err != nil {
		return fmt.Errorf("canonical serialization failed: %w", err)
	}
	sig := ed25519.Sign(privKey, canonical)
	p.ProofSignature = hex.EncodeToString(sig)
	return nil
}

// Verify verifies the proof's signature against the given Ed25519 public key.
func (p *PacketDeliveryProof) Verify(pubKey ed25519.PublicKey) (bool, error) {
	canonical, err := p.CanonicalBytes()
	if err != nil {
		return false, fmt.Errorf("canonical serialization failed: %w", err)
	}
	sig, err := hex.DecodeString(p.ProofSignature)
	if err != nil {
		return false, fmt.Errorf("invalid signature hex: %w", err)
	}
	return ed25519.Verify(pubKey, canonical, sig), nil
}

// HashPayload computes SHA256 of arbitrary payload bytes.
func HashPayload(data []byte) string {
	h := sha256.Sum256(data)
	return hex.EncodeToString(h[:])
}
