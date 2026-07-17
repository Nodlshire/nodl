package account

import (
	"crypto/ed25519"
	"encoding/base64"
	"fmt"
)

// VerifyHeartbeatSignature decodes the provided base64 public key and signature
// and verifies that the signature is valid for the given payload.
func VerifyHeartbeatSignature(pubKeyBase64 string, sigBase64 string, payload []byte) error {
	pubKeyBytes, err := base64.StdEncoding.DecodeString(pubKeyBase64)
	if err != nil {
		return fmt.Errorf("failed to decode pubkey: %w", err)
	}

	sigBytes, err := base64.StdEncoding.DecodeString(sigBase64)
	if err != nil {
		return fmt.Errorf("failed to decode signature: %w", err)
	}

	if len(pubKeyBytes) != ed25519.PublicKeySize {
		return fmt.Errorf("invalid ed25519 public key size")
	}
	
	if len(sigBytes) != ed25519.SignatureSize {
		return fmt.Errorf("invalid ed25519 signature size")
	}

	valid := ed25519.Verify(pubKeyBytes, payload, sigBytes)
	if !valid {
		return fmt.Errorf("signature verification failed")
	}

	return nil
}
