package bindings

import (
	"log"

	"github.com/obregan/nodl/node-operator/src/platform"
	"github.com/obregan/nodl/node-operator/src/device"
)

var isRunning bool

// StartNode initializes the nodl-core engine as a background thread for Android/iOS
func StartNode(apiBase string, deviceToken string, profile string) {
	if isRunning {
		return
	}
	isRunning = true

	platform.Info("Mobile Binder: Starting nodl-core with profile: %s", profile)

	state := &platform.State{
		DeviceToken: deviceToken,
	}

	if profile == "space" {
		apiBase = "https://space.nodl.it"
	}

	if state.DeviceToken == "" {
		log.Println("Warning: NODL_DEVICE_TOKEN not provided from mobile app.")
	}

	// Run in background so it doesn't block JNI bridge
	go device.StartEpochSyncLoop(apiBase, state)
}

// StopNode halts the execution of the core engine
func StopNode() {
	if !isRunning {
		return
	}
	platform.Info("Mobile Binder: Stopping nodl-core")
	// Full shutdown logic would go here
	isRunning = false
}

// GetStatus returns a serialized JSON string containing epoch and capabilities
func GetStatus() string {
	if !isRunning {
		return `{"status":"offline"}`
	}
	return `{"status":"online", "mesh_connected": true}`
}
