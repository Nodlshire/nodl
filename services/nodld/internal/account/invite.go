package account

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
)

type WUIDComponents struct {
	Raw      string `json:"raw"`
	Sequence string `json:"sequence"`
	Batch    string `json:"batch"`
	Slot     string `json:"slot"`
	Checksum string `json:"checksum"`
	IsValid  bool   `json:"isValid"`
}

var wuidRegex = regexp.MustCompile(`^(\d{6,7})-(\d{4})-(\d{2})-([A-Za-z0-9]{2})$`)

// ParseWUID validates and parses a WUID into structured components.
func ParseWUID(code string) (*WUIDComponents, error) {
	trimmed := strings.TrimSpace(code)
	matches := wuidRegex.FindStringSubmatch(trimmed)
	if len(matches) != 5 {
		return nil, fmt.Errorf("invalid WUID format: %s", code)
	}
	return &WUIDComponents{
		Raw:      trimmed,
		Sequence: matches[1],
		Batch:    matches[2],
		Slot:     matches[3],
		Checksum: strings.ToUpper(matches[4]),
		IsValid:  true,
	}, nil
}

// ParseAndLogAffiliateCode parses a WUID code and emits invite_code_parsed telemetry.
func (s *Store) ParseAndLogAffiliateCode(code string) (*WUIDComponents, error) {
	comp, err := ParseWUID(code)
	if err != nil {
		return nil, err
	}

	if s.Telemetry != nil {
		s.Telemetry.Publish(&TelemetryEvent{
			EventType: "invite_code_parsed",
			Payload: map[string]interface{}{
				"wuid":      comp.Raw,
				"sequence":  comp.Sequence,
				"batch":     comp.Batch,
				"slot":      comp.Slot,
				"checksum":  comp.Checksum,
				"isValid":   comp.IsValid,
				"timestamp": time.Now().Format(time.RFC3339),
			},
		})
	}
	return comp, nil
}

func (s *Store) initInviteState() {
	if s.inviteState == nil {
		secretBytes := make([]byte, 64)
		rand.Read(secretBytes)
		s.inviteState = &InviteState{
			Secret:           hex.EncodeToString(secretBytes),
			NextFounderIndex: 1,
			Registry:         make(map[string]*AffiliateInvite),
		}
	}
	if s.inviteState.Registry == nil {
		s.inviteState.Registry = make(map[string]*AffiliateInvite)
	}
	if s.inviteState.NextFounderIndex == 0 {
		s.inviteState.NextFounderIndex = 1
	}
}

// pruneExpiredInvites removes expired tokens from the registry.
// Must be called with s.mu Lock held.
func (s *Store) pruneExpiredInvites() {
	now := time.Now()
	for k, inv := range s.inviteState.Registry {
		if now.After(inv.ExpiresAt) {
			delete(s.inviteState.Registry, k)
		}
	}
}

// signInvitePayload generates an HMAC-SHA256 signature for the invite token.
func (s *Store) signInvitePayload(inviter, target string, exp int64, nonce string) string {
	payload := fmt.Sprintf("%s:%s:%d:%s", inviter, target, exp, nonce)
	h := hmac.New(sha256.New, []byte(s.inviteState.Secret))
	h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}

// GenerateAffiliateInvite creates a single-use invite for a specific founder/partner.
func (s *Store) GenerateAffiliateInvite(inviterWUID, placementTargetWUID string) (*AffiliateInvite, error) {
	invite, err := s.generateAffiliateInviteInternal(inviterWUID, placementTargetWUID)
	if err == nil {
		s.SaveState()
	}
	return invite, err
}

func (s *Store) generateAffiliateInviteInternal(inviterWUID, placementTargetWUID string) (*AffiliateInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	id := uuid.New().String()
	exp := time.Now().Add(24 * time.Hour)
	nonceBytes := make([]byte, 32)
	rand.Read(nonceBytes)
	nonce := hex.EncodeToString(nonceBytes)

	sig := s.signInvitePayload(inviterWUID, placementTargetWUID, exp.Unix(), nonce)

	// Token format: base64(json) or just construct a struct and base64 it.
	// We'll just construct a simple JWT-like structure or just pass the parameters in a JSON object base64'd
	// Wait, we can just use the signature as the token, and store the metadata in the registry!
	// The prompt requested:
	// Token payload: { "inviter": "...", "target": "...", "exp": ..., "nonce": "..." }
	// Signature: HMAC-SHA256(secret, payload)

	payloadMap := map[string]interface{}{
		"inviter": inviterWUID,
		"target":  placementTargetWUID,
		"exp":     exp.Unix(),
		"nonce":   nonce,
		"sig":     sig,
	}

	payloadBytes, _ := json.Marshal(payloadMap)
	tokenString := hex.EncodeToString(payloadBytes)

	invite := &AffiliateInvite{
		ID:                  id,
		InviterWUID:         inviterWUID,
		PlacementTargetWUID: placementTargetWUID,
		Token:               tokenString,
		Used:                false,
		ExpiresAt:           exp,
		CreatedAt:           time.Now(),
	}

	s.pruneExpiredInvites()
	s.inviteState.Registry[tokenString] = invite

	return invite, nil
}

// GenerateGlobalInvite creates a single-use invite using the round-robin logic.
func (s *Store) GenerateGlobalInvite() (*AffiliateInvite, error) {
	s.mu.Lock()
	// Round Robin Rules: Always rotate 1 -> 2 -> 3 -> 4 -> 1. DO NOT skip empty slots.
	index := s.inviteState.NextFounderIndex
	
	// Advance pointer (wrap at 4)
	s.inviteState.NextFounderIndex++
	if s.inviteState.NextFounderIndex > 4 {
		s.inviteState.NextFounderIndex = 1
	}

	// Wait, the prompt says DO NOT skip empty founder slots. But we need a placementTargetWUID!
	// If the slot is empty, the placementTargetWUID will be "FOUNDER-SLOT-XX".
	target := s.founders[index-1]
	if target == "" {
		target = fmt.Sprintf("FOUNDER-SLOT-%02d", index)
	}
	
	s.mu.Unlock()

	return s.GenerateAffiliateInvite("global", target)
}

// GenerateFounderInvite creates a Founder slot invite.
func (s *Store) GenerateFounderInvite(slot int) (*AffiliateInvite, error) {
	invite, err := s.generateFounderInviteInternal(slot)
	if err == nil {
		s.SaveState()
	}
	return invite, err
}

func (s *Store) generateFounderInviteInternal(slot int) (*AffiliateInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if slot < 1 || slot > 4 {
		return nil, fmt.Errorf("invalid founder slot")
	}

	if s.founders[slot-1] != "" {
		return nil, fmt.Errorf("founder slot %d is already filled", slot)
	}

	id := uuid.New().String()
	exp := time.Now().Add(24 * time.Hour)
	nonceBytes := make([]byte, 32)
	rand.Read(nonceBytes)
	nonce := hex.EncodeToString(nonceBytes)

	sig := s.signInvitePayload("owner", fmt.Sprintf("slot-%d", slot), exp.Unix(), nonce)

	payloadMap := map[string]interface{}{
		"inviter":     "owner",
		"target":      fmt.Sprintf("slot-%d", slot),
		"role":        "founder",
		"founderSlot": slot,
		"exp":         exp.Unix(),
		"nonce":       nonce,
		"sig":         sig,
	}

	payloadBytes, _ := json.Marshal(payloadMap)
	tokenString := hex.EncodeToString(payloadBytes)

	invite := &AffiliateInvite{
		ID:                  id,
		InviterWUID:         "owner",
		PlacementTargetWUID: "",
		Role:                "founder",
		FounderSlot:         slot,
		Token:               tokenString,
		Used:                false,
		ExpiresAt:           exp,
		CreatedAt:           time.Now(),
	}

	s.pruneExpiredInvites()
	s.inviteState.Registry[tokenString] = invite

	return invite, nil
}

// ConsumeAffiliateInvite validates a token and marks it as used.
func (s *Store) ConsumeAffiliateInvite(tokenStr string) (*AffiliateInvite, error) {
	invite, err := s.consumeAffiliateInviteInternal(tokenStr)
	if err == nil {
		s.SaveState()
	}
	return invite, err
}

func (s *Store) consumeAffiliateInviteInternal(tokenStr string) (*AffiliateInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	invite, ok := s.inviteState.Registry[tokenStr]
	if !ok {
		return nil, fmt.Errorf("invalid or unrecognized invite token")
	}

	if invite.Used {
		return nil, fmt.Errorf("invite token has already been used")
	}

	if time.Now().After(invite.ExpiresAt) {
		return nil, fmt.Errorf("invite token has expired")
	}

	// Validate signature from payload
	tokenBytes, err := hex.DecodeString(tokenStr)
	if err != nil {
		return nil, fmt.Errorf("malformed invite token")
	}

	var payloadMap map[string]interface{}
	if err := json.Unmarshal(tokenBytes, &payloadMap); err != nil {
		return nil, fmt.Errorf("malformed invite payload")
	}

	inviter, _ := payloadMap["inviter"].(string)
	target, _ := payloadMap["target"].(string)
	expF, _ := payloadMap["exp"].(float64)
	nonce, _ := payloadMap["nonce"].(string)
	sig, _ := payloadMap["sig"].(string)

	expectedSig := s.signInvitePayload(inviter, target, int64(expF), nonce)
	if sig != expectedSig {
		return nil, fmt.Errorf("invite token signature mismatch")
	}

	// Mark used
	invite.Used = true
	s.pruneExpiredInvites()

	return invite, nil
}

// GeneratePartnerInvite creates a Partner slot invite.
func (s *Store) GeneratePartnerInvite(slot int) (*AffiliateInvite, error) {
	invite, err := s.generatePartnerInviteInternal(slot)
	if err == nil {
		s.SaveState()
	}
	return invite, err
}

func (s *Store) generatePartnerInviteInternal(slot int) (*AffiliateInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if slot < 5 || slot > 10 {
		return nil, fmt.Errorf("invalid partner slot")
	}

	if s.founders[slot-1] != "" {
		return nil, fmt.Errorf("partner slot %d is already filled", slot)
	}

	id := uuid.New().String()
	exp := time.Now().Add(24 * time.Hour)
	nonceBytes := make([]byte, 32)
	rand.Read(nonceBytes)
	nonce := hex.EncodeToString(nonceBytes)

	sig := s.signInvitePayload("owner", fmt.Sprintf("slot-%d", slot), exp.Unix(), nonce)

	payloadMap := map[string]interface{}{
		"inviter":     "owner",
		"target":      fmt.Sprintf("slot-%d", slot),
		"role":        "partner",
		"founderSlot": slot,
		"exp":         exp.Unix(),
		"nonce":       nonce,
		"sig":         sig,
	}

	payloadBytes, _ := json.Marshal(payloadMap)
	tokenString := hex.EncodeToString(payloadBytes)

	invite := &AffiliateInvite{
		ID:                  id,
		InviterWUID:         "owner",
		PlacementTargetWUID: "",
		Role:                "partner",
		FounderSlot:         slot,
		Token:               tokenString,
		Used:                false,
		ExpiresAt:           exp,
		CreatedAt:           time.Now(),
	}

	s.pruneExpiredInvites()
	s.inviteState.Registry[tokenString] = invite

	return invite, nil
}
