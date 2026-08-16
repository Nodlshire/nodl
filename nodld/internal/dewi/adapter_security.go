package dewi

import (
	"crypto/ed25519"
	"encoding/hex"
	"fmt"
	"time"
)

// PermissionScope defines granular action permissions.
type PermissionScope string

const (
	ScopeReadTelemetry PermissionScope = "READ_TELEMETRY"
	ScopeWriteConfig    PermissionScope = "WRITE_CONFIG"
	ScopeExecuteTX      PermissionScope = "EXECUTE_TX"
	ScopeExecuteRX      PermissionScope = "EXECUTE_RX"
	ScopeReadHealth     PermissionScope = "READ_HEALTH"
	ScopeWriteRegion    PermissionScope = "WRITE_REGION"
	ScopeExecuteRecovery PermissionScope = "EXECUTE_RECOVERY"
)

// OperatorIdentity represents an authenticated operator key.
type OperatorIdentity struct {
	OperatorID  string            `json:"operatorId"`
	PublicKeyHex string           `json:"publicKeyHex"`
	Role        string            `json:"role"` // "ADMIN", "SUPERVISOR", "OPERATOR", "VIEWER"
	Permissions []PermissionScope `json:"permissions"`
	CreatedAt   time.Time         `json:"createdAt"`
}

// SignedCommand represents a cryptographically signed operator command.
type SignedCommand struct {
	CommandID string          `json:"commandId"`
	AdapterID string          `json:"adapterId"`
	Command   string          `json:"command"`
	Value     interface{}     `json:"value,omitempty"`
	Timestamp time.Time       `json:"timestamp"`
	Signature string          `json:"signature"`
	PublicKey string          `json:"publicKey"`
}

// ValidatePermission checks if an operator role/permissions set includes a required scope.
func (op *OperatorIdentity) HasPermission(required PermissionScope) bool {
	if op.Role == "ADMIN" {
		return true
	}
	for _, p := range op.Permissions {
		if p == required {
			return true
		}
	}
	return false
}

// VerifyCommandSignature verifies the Ed25519 signature on a signed command.
func VerifyCommandSignature(cmd *SignedCommand) (bool, error) {
	if cmd == nil || cmd.Signature == "" || cmd.PublicKey == "" {
		return false, fmt.Errorf("missing signature or public key")
	}

	pubKeyBytes, err := hex.DecodeString(cmd.PublicKey)
	if err != nil {
		return false, fmt.Errorf("invalid public key hex: %w", err)
	}

	sigBytes, err := hex.DecodeString(cmd.Signature)
	if err != nil {
		return false, fmt.Errorf("invalid signature hex: %w", err)
	}

	msg := fmt.Sprintf("%s:%s:%s:%s", cmd.CommandID, cmd.AdapterID, cmd.Command, cmd.Timestamp.Format(time.RFC3339))
	return ed25519.Verify(ed25519.PublicKey(pubKeyBytes), []byte(msg), sigBytes), nil
}
