package main

import (
	"flag"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"

	"github.com/obregan/nodl/node-operator/src/auth"
	"github.com/obregan/nodl/node-operator/src/device"
	"github.com/obregan/nodl/node-operator/src/platform"
)

func getDefaultTokenPath() string {
	if runtime.GOOS == "windows" {
		return filepath.Join(os.Getenv("PROGRAMDATA"), "Wnode", "token")
	}
	return "/etc/wnode/token"
}

func getEnvOrDefault(keys []string, fallback string) string {
	for _, key := range keys {
		if val := strings.TrimSpace(os.Getenv(key)); val != "" {
			return val
		}
	}
	return fallback
}

func main() {
	defaultApi := getEnvOrDefault([]string{"WNODE_API_BASE", "NODL_API_BASE", "API_BASE"}, "https://cmd.wnode.one")

	flagSet := flag.NewFlagSet("nodl-core", flag.ContinueOnError)
	profile := flagSet.String("profile", "earth", "Execution profile (earth, space, headless)")
	apiBaseFlag := flagSet.String("api", defaultApi, "Orchestrator API Base URL")
	tokenFlag := flagSet.String("token", "", "Registration token from Nodlr")

	// Filter positional subcommands like 'daemon' from flag parsing
	var cleanArgs []string
	for _, arg := range os.Args[1:] {
		if arg == "daemon" || arg == "run" || arg == "start" {
			continue
		}
		cleanArgs = append(cleanArgs, arg)
	}
	_ = flagSet.Parse(cleanArgs)

	// Determine effective API Base URL
	apiBase := *apiBaseFlag
	if envApi := getEnvOrDefault([]string{"WNODE_API_BASE", "NODL_API_BASE", "API_BASE"}, ""); envApi != "" {
		apiBase = envApi
	}
	apiBase = strings.TrimRight(apiBase, "/")

	platform.Info("Starting nodl-core with profile: %s", *profile)
	platform.Info("API Base: %s", apiBase)

	state, loadErr := platform.LoadState()
	if loadErr != nil || state == nil {
		state = &platform.State{
			Version:     "1.0.0",
			DeviceToken: os.Getenv("NODL_DEVICE_TOKEN"),
		}
	} else if state.DeviceToken == "" {
		state.DeviceToken = os.Getenv("NODL_DEVICE_TOKEN")
	}

	if *profile == "space" {
		platform.Info("Loading Space Mesh configuration from config/space.config.json")
		apiBase = "https://space.nodl.it"
	} else if *profile == "earth-headless" {
		platform.Info("Loading Headless Earth configuration from config/earth-headless.config.json")
		apiBase = "https://api.wnode.one"
	}

	tokenToUse := strings.TrimSpace(*tokenFlag)

	if state.DeviceToken == "" {
		tokenFile := ""
		if tokenToUse == "" {
			tokenFile = getDefaultTokenPath()
			if _, err := os.Stat(tokenFile); os.IsNotExist(err) {
				if home, err := os.UserHomeDir(); err == nil {
					tokenFile = filepath.Join(home, ".wnode", "token")
				}
			}

			if tokenData, err := os.ReadFile(tokenFile); err == nil {
				tokenToUse = strings.TrimSpace(string(tokenData))
				platform.Info("Found registration token in %s, attempting headless registration...", tokenFile)
			}
		}

		if tokenToUse != "" {
			// Hydrate state with hardware identity before registration
			bootMetrics := device.CollectMetrics(state)
			bootMeta := device.CollectMetadata()
			if state.UPID == "" {
				state.UPID = device.ComputeHardwareHash(bootMeta)
			}
			state.CPUCores = bootMetrics.CPUCores
			state.MemoryGB = bootMetrics.MemoryGB
			_ = platform.SaveState(state)
			platform.Info("Hardware snapshot: UPID=%s CPUCores=%d MemoryGB=%d", state.UPID, state.CPUCores, state.MemoryGB)

			if err := auth.AuthenticateHeadless(apiBase, tokenToUse, state); err != nil {
				if strings.Contains(err.Error(), "status 40") {
					log.Printf("Headless registration rejected (invalid or expired token). Purging token file.")
					if tokenFile != "" {
						os.Remove(tokenFile)
					}
					log.Fatalf("Fatal: %v", err)
				}
				log.Fatalf("Headless registration failed: %v", err)
			}
			if tokenFile != "" {
				os.Remove(tokenFile)
			}
		} else {
			log.Println("Warning: NODL_DEVICE_TOKEN not set and no registration token found. Joining mesh might fail.")
		}
	}

	// Start Routing Epoch Synchronization
	go device.StartEpochSyncLoop(apiBase, state)

	platform.Info("nodl-core is now running and awaiting deterministic workloads...")

	// Graceful Shutdown Channel
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	sig := <-sigChan
	platform.Info("Received signal: %v. Initiating graceful shutdown...", sig)
	platform.Info("nodl-core stopped gracefully.")
}
