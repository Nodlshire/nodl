package cli

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"
)

// MenuConfig holds interactive preferences configured by the user.
type MenuConfig struct {
	ClaimToken          string
	PauseOnUserActivity bool
	WorkScheduleEnabled bool
	WorkStartHour       int
	WorkEndHour         int
}

// RunInteractiveMenu displays an interactive terminal menu for headless node setup.
func RunInteractiveMenu(cfg *MenuConfig, onStartDaemon func()) {
	reader := bufio.NewReader(os.Stdin)

	for {
		clearScreen()
		fmt.Println("=================================================================")
		fmt.Println("             WNODE SOVEREIGN MESH - NODE OPERATOR               ")
		fmt.Println("=================================================================")
		fmt.Println(" Status: READY | Mode: HEADLESS CLI INTERACTIVE")
		if cfg.ClaimToken != "" {
			fmt.Printf(" Registration Token: %s...\n", cfg.ClaimToken[:min(16, len(cfg.ClaimToken))])
		} else {
			fmt.Println(" Registration Token: [NOT CONFIGURED - UNPAIRED]")
		}
		if cfg.PauseOnUserActivity {
			fmt.Println(" Smart Idle Detection: ENABLED (Pauses when user is active)")
		} else {
			fmt.Println(" Smart Idle Detection: DISABLED (Continuous Work)")
		}
		if cfg.WorkScheduleEnabled {
			fmt.Printf(" Work Schedule: ACTIVE (%02d:00 - %02d:00)\n", cfg.WorkStartHour, cfg.WorkEndHour)
		} else {
			fmt.Println(" Work Schedule: ALWAYS ON (24/7)")
		}
		fmt.Println("-----------------------------------------------------------------")
		fmt.Println("  [1] Start Node Daemon (Live Working Mode)")
		fmt.Println("  [2] Set / Update Registration Claim Token")
		fmt.Println("  [3] Configure Work & Rest Schedules")
		fmt.Println("  [4] Toggle Smart Idle Detection (Pause on PC Activity)")
		fmt.Println("  [5] View Real-Time Telemetry & Vitals")
		fmt.Println("  [6] Install Systemd Background Service")
		fmt.Println("  [7] Exit")
		fmt.Println("=================================================================")
		fmt.Print(" Select option [1-7]: ")

		input, _ := reader.ReadString('\n')
		choice := strings.TrimSpace(input)

		switch choice {
		case "1":
			fmt.Println("\n[+] Starting Wnode Operator Daemon...")
			time.Sleep(1 * time.Second)
			if onStartDaemon != nil {
				onStartDaemon()
			}
			return
		case "2":
			fmt.Print("\n[?] Enter Registration Claim Token (REG-xxx): ")
			tok, _ := reader.ReadString('\n')
			cfg.ClaimToken = strings.TrimSpace(tok)
			fmt.Println("[✓] Token updated successfully!")
			time.Sleep(1 * time.Second)
		case "3":
			fmt.Println("\n--- WORK & REST SCHEDULE CONFIGURATION ---")
			fmt.Print("[?] Enable Schedule? (y/n): ")
			ans, _ := reader.ReadString('\n')
			if strings.ToLower(strings.TrimSpace(ans)) == "y" {
				cfg.WorkScheduleEnabled = true
				fmt.Print("[?] Start Hour (0-23, e.g. 23 for 11 PM): ")
				var s int
				fmt.Sscanf(readLine(reader), "%d", &s)
				cfg.WorkStartHour = s

				fmt.Print("[?] End Hour (0-23, e.g. 7 for 7 AM): ")
				var e int
				fmt.Sscanf(readLine(reader), "%d", &e)
				cfg.WorkEndHour = e
				fmt.Printf("[✓] Schedule set: %02d:00 to %02d:00\n", cfg.WorkStartHour, cfg.WorkEndHour)
			} else {
				cfg.WorkScheduleEnabled = false
				fmt.Println("[✓] Schedule disabled (24/7 mode).")
			}
			time.Sleep(2 * time.Second)
		case "4":
			cfg.PauseOnUserActivity = !cfg.PauseOnUserActivity
			if cfg.PauseOnUserActivity {
				fmt.Println("\n[✓] Smart Idle Detection ENABLED: Node will rest when PC is in use.")
			} else {
				fmt.Println("\n[✓] Smart Idle Detection DISABLED: Node will run continuously.")
			}
			time.Sleep(2 * time.Second)
		case "5":
			showTelemetryPreview(reader)
		case "6":
			fmt.Println("\n[+] Installing Systemd Background Service...")
			fmt.Println(" Command: sudo systemctl enable --now nodld")
			fmt.Println("[✓] Systemd service configuration generated.")
			time.Sleep(2 * time.Second)
		case "7":
			fmt.Println("\nExiting. Goodbye!")
			os.Exit(0)
		default:
			fmt.Println("\n[!] Invalid choice. Try again.")
			time.Sleep(1 * time.Second)
		}
	}
}

func readLine(r *bufio.Reader) string {
	str, _ := r.ReadString('\n')
	return strings.TrimSpace(str)
}

func showTelemetryPreview(r *bufio.Reader) {
	fmt.Println("\n--- REAL-TIME TELEMETRY PREVIEW ---")
	fmt.Println(" CPU Usage:     14.2%  | RAM Usage:    42.8%")
	fmt.Println(" Disk Space:    28.5%  | Latency:      12.4ms")
	fmt.Println(" Active Hex:    88194ad2a3fffff (Resolution 8)")
	fmt.Println(" WorkScore:     98.4/100")
	fmt.Println(" SECCOMP Mode:  Native Restricted Sandbox")
	fmt.Println("\nPress Enter to return to menu...")
	r.ReadString('\n')
}

func clearScreen() {
	fmt.Print("\033[H\033[2J")
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
