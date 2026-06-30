package main

import (
	"flag"
	"log"
	"os"

	"github.com/obregan/nodl/node-operator/src/platform"
	"github.com/obregan/nodl/node-operator/src/device"
)

func main() {
	profile := flag.String("profile", "earth", "Execution profile (earth, space, headless)")
	apiBase := flag.String("api", "http://localhost:3000", "Orchestrator API Base URL")
	flag.Parse()

	platform.Info("Starting nodl-core with profile: %s", *profile)
	platform.Info("API Base: %s", *apiBase)

	state := &platform.State{
		DeviceToken: os.Getenv("NODL_DEVICE_TOKEN"),
	}

	if *profile == "space" {
		platform.Info("Loading Space Mesh configuration from config/space.config.json")
		// In a full implementation, parse space.config.json and override API Base, etc.
		*apiBase = "https://space.nodl.it"
	}

	if state.DeviceToken == "" {
		log.Println("Warning: NODL_DEVICE_TOKEN not set, joining mesh might fail.")
	}

	// Start Routing Epoch Synchronization
	go device.StartEpochSyncLoop(*apiBase, state)

	// Keep the core running
	platform.Info("nodl-core is now running and awaiting deterministic workloads...")
	select {}
}
