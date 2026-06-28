package mesh

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
)

type IntegrityProtectedMessage struct {
	MessageID          string
	SenderNodeID       string
	PayloadHash        string
	Payload            interface{}
	IntegrityProof     string
	SenderCapabilities []string
}

type MeshIntegrityValidator struct {
	authRegistry *MeshAuthRegistry
	macSecret    string
}

func NewMeshIntegrityValidator(auth *MeshAuthRegistry) *MeshIntegrityValidator {
	return &MeshIntegrityValidator{
		authRegistry: auth,
		macSecret:    "mesh-phase1.6-mac-secret",
	}
}

func (v *MeshIntegrityValidator) ValidateMessage(msg IntegrityProtectedMessage) error {
	if !v.authRegistry.IsTrusted(msg.SenderNodeID) {
		return errors.New("INTEGRITY_REJECTED: Sender not trusted")
	}

	b, _ := json.Marshal(msg.Payload)
	hash := sha256.Sum256(b)
	hashHex := hex.EncodeToString(hash[:])

	if hashHex != msg.PayloadHash {
		v.authRegistry.MarkSuspicious(msg.SenderNodeID)
		return errors.New("INTEGRITY_REJECTED: Payload hash mismatch")
	}

	expectedProof := v.ComputeIntegrityProof(msg.MessageID, msg.PayloadHash, msg.SenderNodeID)
	if msg.IntegrityProof != expectedProof {
		v.authRegistry.MarkSuspicious(msg.SenderNodeID)
		return errors.New("INTEGRITY_REJECTED: Invalid integrity proof")
	}

	return nil
}

func (v *MeshIntegrityValidator) ComputeIntegrityProof(messageID, payloadHash, senderNodeID string) string {
	data := messageID + ":" + payloadHash + ":" + senderNodeID
	mac := hmac.New(sha256.New, []byte(v.macSecret))
	mac.Write([]byte(data))
	return hex.EncodeToString(mac.Sum(nil))
}
