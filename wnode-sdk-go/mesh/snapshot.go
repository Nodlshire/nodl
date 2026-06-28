package mesh

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
)

type MeshSnapshot struct {
	State     MeshState `json:"state"`
	StateHash string    `json:"stateHash"`
}

type MeshSnapshotEngine struct{}

func NewMeshSnapshotEngine() *MeshSnapshotEngine {
	return &MeshSnapshotEngine{}
}

func (e *MeshSnapshotEngine) ValidateSnapshot(snapshot MeshSnapshot) error {
	b, _ := json.Marshal(snapshot.State)
	hash := sha256.Sum256(b)
	computedHash := hex.EncodeToString(hash[:])

	if computedHash != snapshot.StateHash {
		return errors.New("INTEGRITY_REJECTED: snapshot hash mismatch")
	}
	if snapshot.State.Version != "1.0" {
		return errors.New("unsupported snapshot version")
	}
	return nil
}
