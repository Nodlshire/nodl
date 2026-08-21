package mesh

import "errors"

type MeshRecoveryEngine struct {
	snapshotEngine *MeshSnapshotEngine
	journal        *MeshEventJournal
}

func NewMeshRecoveryEngine(se *MeshSnapshotEngine, j *MeshEventJournal) *MeshRecoveryEngine {
	return &MeshRecoveryEngine{
		snapshotEngine: se,
		journal:        j,
	}
}

func (r *MeshRecoveryEngine) ReconstructState(snapshot MeshSnapshot, events []MeshEvent) (MeshState, error) {
	err := r.snapshotEngine.ValidateSnapshot(snapshot)
	if err != nil {
		return MeshState{}, err
	}

	state := snapshot.State

	for _, event := range events {
		if !r.journal.ValidateEvent(event) {
			return MeshState{}, errors.New("event integrity validation failed")
		}
		// Basic apply stub
		if event.EventType == EventSecurityIncident {
			// append to state
		}
	}

	return state, nil
}
