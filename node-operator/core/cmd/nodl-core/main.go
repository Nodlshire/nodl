package main

import (
	"flag"
	"log"
	"os"

	"github.com/obregan/nodl/node-operator/src/platform"
	"github.com/obregan/nodl/node-operator/src/device"
	"github.com/obregan/nodl/node-operator/src/auth"
	"strings"
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
	} else if *profile == "earth-headless" {
		platform.Info("Loading Headless Earth configuration from config/earth-headless.config.json")
		*apiBase = "http://127.0.0.1:8080"
	}

	if state.DeviceToken == "" {
		tokenFile := "/etc/wnode/token"
		if _, err := os.Stat(tokenFile); os.IsNotExist(err) {
			tokenFile = os.ExpandEnv("$HOME/.wnode/token")
		}

		if tokenData, err := os.ReadFile(tokenFile); err == nil {
			token := strings.TrimSpace(string(tokenData))
			platform.Info("Found registration token in %s, attempting headless registration...", tokenFile)
			if err := auth.AuthenticateHeadless(*apiBase, token, state); err != nil {
				log.Fatalf("Headless registration failed: %v", err)
			}
			// Delete token file after successful consumption
			os.Remove(tokenFile)
		} else {
			log.Println("Warning: NODL_DEVICE_TOKEN not set and no registration token found. Joining mesh might fail.")
		}
	}

	// Start Routing Epoch Synchronization
	go device.StartEpochSyncLoop(*apiBase, state)

	// Keep the core running
	platform.Info("nodl-core is now running and awaiting deterministic workloads...")
	select {}
}
