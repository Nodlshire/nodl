package platform

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// State represents the local configuration and authentication state of the node.
type State struct {
	Version         string `json:"version"`
	SessionToken    string `json:"session_token,omitempty"`
	OperatorID      string `json:"operator_id,omitempty"`
	DeviceToken     string `json:"device_token,omitempty"`
	NodeID            string `json:"node_id,omitempty"`
	DeviceUUID        string `json:"device_uuid,omitempty"`
	UPID              string `json:"upid,omitempty"`
	CPUCores          int    `json:"cpu_cores,omitempty"`
	MemoryGB          int    `json:"memory_gb,omitempty"`
	MeshAPI           string `json:"mesh_api"`
	HeartbeatOffset   int    `json:"heartbeat_offset"`
	HeartbeatInterval int    `json:"heartbeat_interval"`
	AuthenticatedAt   string           `json:"authenticated_at,omitempty"`
	RegisteredAt      string           `json:"registered_at,omitempty"`
	Reputation        *ReputationState `json:"reputation,omitempty"`
	Schedule          *ScheduleConfig  `json:"schedule,omitempty"`
}

// ScheduleConfig holds active work windows for desktop and headless nodes.
type ScheduleConfig struct {
	Enabled   bool     `json:"enabled"`
	StartTime string   `json:"start_time"` // "23:00" (HH:MM 24h format)
	EndTime   string   `json:"end_time"`   // "07:00" (HH:MM 24h format)
	Days      []string `json:"days"`       // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
}

// ReputationState holds local rolling metrics for Node performance and rewards.
type ReputationState struct {
	LocalScore         float64 `json:"localScore"`
	TotalTasks         int     `json:"totalTasks"`
	SuccessfulTasks    int     `json:"successfulTasks"`
	Failures           int     `json:"failures"`
	Timeouts           int     `json:"timeouts"`
	AvgShardDurationMs int64   `json:"avgShardDurationMs"`
	TotalWU            int     `json:"totalWU"`
	TotalRewards       float64 `json:"totalRewards"`
}

func getWnodeDir() (string, error) {
	dir := os.Getenv("WNODE_DIR")
	if dir == "" {
		dir = os.Getenv("NODL_DIR")
	}
	if dir != "" {
		if err := os.MkdirAll(dir, 0755); err == nil {
			return dir, nil
		}
	}

	if runtime.GOOS == "windows" {
		if appData := os.Getenv("APPDATA"); appData != "" {
			dir = filepath.Join(appData, "nodl")
			if err := os.MkdirAll(dir, 0755); err == nil {
				return dir, nil
			}
		}
	}

	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home dir: %w", err)
	}
	dir = filepath.Join(home, ".nodl")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create .nodl dir: %w", err)
	}
	return dir, nil
}

func getStatePath() (string, error) {
	dir, err := getWnodeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "operator.sec"), nil
}

// LoadState reads the state from ~/.wnode/operator.sec and decrypts it.
// If the file does not exist or decryption fails, it returns an empty State.
func LoadState() (*State, error) {
	path, err := getStatePath()
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return &State{
				Version: "0.1.0",
			}, nil
		}
		return nil, fmt.Errorf("failed to read state file: %w", err)
	}

	machineUUID := GetMachineUUID()
	plaintext, err := Decrypt(data, machineUUID)
	if err != nil {
		Warn("State decryption failed: %v. Reverting to clean state.", err)
		_ = os.Remove(path)
		return &State{
			Version: "0.1.0",
		}, nil
	}

	var state State
	if err := json.Unmarshal(plaintext, &state); err != nil {
		return nil, fmt.Errorf("failed to parse state file: %w", err)
	}
	return &state, nil
}

// SaveState encrypts and writes the state to ~/.wnode/operator.sec.
func SaveState(state *State) error {
	path, err := getStatePath()
	if err != nil {
		return err
	}

	data, err := json.Marshal(state)
	if err != nil {
		return fmt.Errorf("failed to marshal state: %w", err)
	}

	machineUUID := GetMachineUUID()
	ciphertext, err := Encrypt(data, machineUUID)
	if err != nil {
		return fmt.Errorf("failed to encrypt state: %w", err)
	}

	if err := os.WriteFile(path, ciphertext, 0600); err != nil {
		return fmt.Errorf("failed to write state file: %w", err)
	}
	
	// Ensure old json is removed if it exists
	dir, _ := getWnodeDir()
	_ = os.Remove(filepath.Join(dir, "operator.json"))
	
	return nil
}

// UpdateReputation modifies the local score via a decaying moving average and calculates rewards.
// Slow nodes are never penalized; reputation purely reflects reliability (uptime, success vs timeouts/failures).
func (s *State) UpdateReputation(success bool, isTimeout bool, avgDurationMs int64, itemsProcessed int) {
	if s.Reputation == nil {
		s.Reputation = &ReputationState{
			LocalScore: 0.5, // Start at a baseline
		}
	}

	rep := s.Reputation
	rep.TotalTasks++

	var modifier float64

	if success {
		rep.SuccessfulTasks++
		modifier = 1.0

		// Rewards are strictly proportional to Work Units (items processed). No multipliers based on speed.
		baseRate := 0.01 // Base reward per WU
		wu := itemsProcessed
		rep.TotalWU += wu
		rep.TotalRewards += float64(wu) * baseRate
	} else {
		if isTimeout {
			rep.Timeouts++
			modifier = 0.0 // Penalty for unreliability
		} else {
			rep.Failures++
			modifier = 0.2 // Penalty for failure/crash
		}
	}

	// Moving Average Decay: 90% history, 10% recent reliability behavior
	rep.LocalScore = (rep.LocalScore * 0.9) + (modifier * 0.1)

	// Clamp bounds
	if rep.LocalScore > 1.0 {
		rep.LocalScore = 1.0
	} else if rep.LocalScore < 0.0 {
		rep.LocalScore = 0.0
	}

	// Rolling average duration (Used STRICTLY for scheduling priority/matching by CMD, NEVER for penalties)
	if avgDurationMs > 0 {
		if rep.AvgShardDurationMs == 0 {
			rep.AvgShardDurationMs = avgDurationMs
		} else {
			rep.AvgShardDurationMs = (rep.AvgShardDurationMs*9 + avgDurationMs) / 10
		}
	}

	SaveState(s)
}
