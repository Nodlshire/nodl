package dewi

import (
	"crypto/ed25519"
	"testing"
)

func TestPacketDeliveryProof_CanonicalOrdering(t *testing.T) {
	proof := NewProof("op-123", "meshtastic", "Meshtastic", "route-1", []byte("sample payload"), "100")
	proof.Metadata["rssi"] = "-85"
	proof.Metadata["snr"] = "10.2"
	proof.Metadata["channel"] = "primary"

	canonical1, err := proof.CanonicalBytes()
	if err != nil {
		t.Fatalf("CanonicalBytes failed: %v", err)
	}

	// Produce second canonical bytes and verify byte-for-byte equality
	canonical2, err := proof.CanonicalBytes()
	if err != nil {
		t.Fatalf("CanonicalBytes failed second time: %v", err)
	}

	if string(canonical1) != string(canonical2) {
		t.Errorf("canonical bytes not deterministic:\n1: %s\n2: %s", string(canonical1), string(canonical2))
	}
}

func TestPacketDeliveryProof_SignatureInvalidationOnTamper(t *testing.T) {
	pub, priv, err := ed25519.GenerateKey(nil)
	if err != nil {
		t.Fatal(err)
	}

	proof := NewProof("op-999", "reticulum", "RNS/LXMF", "dest-hash-123", []byte("secret data"), "42")
	if err := proof.Sign(priv); err != nil {
		t.Fatalf("failed to sign proof: %v", err)
	}

	valid, err := proof.Verify(pub)
	if err != nil || !valid {
		t.Fatalf("expected signature to be valid: %v", err)
	}

	// Tamper with PayloadSize
	proof.PayloadSize = 99999
	validTampered, _ := proof.Verify(pub)
	if validTampered {
		t.Error("expected tampered proof to fail verification")
	}
}
