package p2p

import (
	"crypto/rand"
	"fmt"
	"os"

	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/peer"
)

// LoadOrCreateIdentity loads a libp2p private key from the given path,
// or creates a new one if it doesn't exist.
func LoadOrCreateIdentity(path string) (crypto.PrivKey, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// Create new identity
		priv, _, err := crypto.GenerateEd25519Key(rand.Reader)
		if err != nil {
			return nil, fmt.Errorf("failed to generate key: %w", err)
		}

		data, err := crypto.MarshalPrivateKey(priv)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal key: %w", err)
		}

		if err := os.WriteFile(path, data, 0600); err != nil {
			return nil, fmt.Errorf("failed to save key: %w", err)
		}

		return priv, nil
	}

	// Load existing identity
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read key file: %w", err)
	}

	priv, err := crypto.UnmarshalPrivateKey(data)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal key: %w", err)
	}

	return priv, nil
}

// GetPeerID extracts the PeerID from a private key.
func GetPeerID(priv crypto.PrivKey) (peer.ID, error) {
	id, err := peer.IDFromPrivateKey(priv)
	if err != nil {
		return "", fmt.Errorf("failed to get peer id: %w", err)
	}
	return id, nil
}
