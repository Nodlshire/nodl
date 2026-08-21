package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Config struct {
	DeviceToken string `json:"deviceToken"`
	NodeID      string `json:"nodeId"`
	UserID      string `json:"userId"`
}

func getAPIBase() string {
	if base := os.Getenv("WNODE_API_BASE"); base != "" {
		return base
	}
	return "http://127.0.0.1:8082"
}

func main() {
	fmt.Println("⭐ Nodlr Compute Agent — Version 1.0.0")
	fmt.Println("--------------------------------------")

	conf, err := loadConfig()
	if err != nil {
		conf = setupFlow()
	}

	if conf == nil || conf.DeviceToken == "" {
		fmt.Println("❌ Failed to initialize agent. Exiting.")
		return
	}

	runAgent(conf)
}

func getConfigPath() string {
	home, _ := os.UserHomeDir()
	dir := filepath.Join(home, ".wnode")
	_ = os.MkdirAll(dir, 0755)
	return filepath.Join(dir, "agent.json")
}

func loadConfig() (*Config, error) {
	path := getConfigPath()
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var conf Config
	if err := json.Unmarshal(data, &conf); err != nil {
		return nil, err
	}
	return &conf, nil
}

func saveConfig(conf *Config) error {
	path := getConfigPath()
	data, _ := json.MarshalIndent(conf, "", "  ")
	return os.WriteFile(path, data, 0600)
}

func setupFlow() *Config {
	fmt.Println("\nNew machine detected. How would you like to connect?")
	fmt.Println("1) Open browser to connect (easiest)")
	fmt.Println("2) Enter pairing code (from dashboard)")
	fmt.Print("\nSelect an option [1-2]: ")

	reader := bufio.NewReader(os.Stdin)
	choice, _ := reader.ReadString('\n')
	choice = strings.TrimSpace(choice)

	if choice == "1" {
		return browserConnectFlow(reader)
	} else if choice == "2" {
		return pairingCodeFlow(reader)
	}

	fmt.Println("Invalid choice.")
	return nil
}

func browserConnectFlow(reader *bufio.Reader) *Config {
	fmt.Println("\n1. Open your browser and go to:")
	fmt.Println("   http://localhost:3004/connect") // In production: wnode.one/connect
	fmt.Println("\n2. Log in and click 'Connect this machine'.")
	fmt.Println("3. Once the dashboard shows 'Connected', enter the device token shown (or it will auto-detect in Phase 5).")
	
	fmt.Print("\nEnter device token: ")
	token, _ := reader.ReadString('\n')
	token = strings.TrimSpace(token)

	if token == "" {
		return nil
	}

	conf := &Config{DeviceToken: token, NodeID: uuid.New().String()}
	saveConfig(conf)
	return conf
}

func pairingCodeFlow(reader *bufio.Reader) *Config {
	fmt.Print("\nEnter your pairing code (e.g. WN-XXXX-YYYY): ")
	code, _ := reader.ReadString('\n')
	code = strings.TrimSpace(code)

	if code == "" {
		fmt.Println("❌ Code cannot be empty.")
		return nil
	}

	// Call backend to consume
	metadata := map[string]string{
		"os":       runtime.GOOS,
		"arch":     runtime.GOARCH,
		"hostname": "local-agent",
	}
	body, _ := json.Marshal(map[string]interface{}{
		"code":     code,
		"metadata": metadata,
	})

	resp, err := http.Post(getAPIBase()+"/api/v1/nodes/pairing-code/consume", "application/json", bytes.NewBuffer(body))
	if err != nil {
		fmt.Printf("❌ Connectivity Error: %v\n", err)
		return nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		fmt.Printf("❌ Backend Error (%d): %s\n", resp.StatusCode, string(respBody))
		return nil
	}

	var res struct {
		DeviceToken string `json:"deviceToken"`
	}
	json.NewDecoder(resp.Body).Decode(&res)

	conf := &Config{DeviceToken: res.DeviceToken, NodeID: uuid.New().String()}
	saveConfig(conf)
	fmt.Println("\n✅ Successfully linked to account.")
	return conf
}

func runAgent(conf *Config) {
	fmt.Printf("\n🚀 Agent Started (Node ID: %s)\n", conf.NodeID)
	fmt.Println("Mode: Background Compute (Earning)")
	fmt.Println("Press Ctrl+C to stop.")

	// Auto-reconnect loop simulation
	for {
		fmt.Printf("[%s] Pulse: Active | Load: %.2f%% | Earnings: $0.00\n", time.Now().Format("15:04:05"), 12.5) // Simulation
		time.Sleep(10 * time.Second)
	}
}
