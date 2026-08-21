package config_test

import (
	"os"
	"testing"

	"github.com/obregan/nodl/nodld/internal/config"
)

func TestLoad_Defaults(t *testing.T) {
	// Clear env so we get pure defaults
	os.Unsetenv("API_PORT")
	os.Unsetenv("P2P_PORT")
	os.Unsetenv("LOG_LEVEL")

	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if cfg.APIPort != 8080 {
		t.Errorf("want APIPort=8080, got %d", cfg.APIPort)
	}
	if cfg.P2PPort != 9000 {
		t.Errorf("want P2PPort=9000, got %d", cfg.P2PPort)
	}
	if cfg.LogLevel != "info" {
		t.Errorf("want LogLevel=info, got %s", cfg.LogLevel)
	}
}

func TestLoad_EnvOverride(t *testing.T) {
	os.Setenv("API_PORT", "9090")
	os.Setenv("P2P_PORT", "9001")
	os.Setenv("LOG_LEVEL", "debug")
	defer func() {
		os.Unsetenv("API_PORT")
		os.Unsetenv("P2P_PORT")
		os.Unsetenv("LOG_LEVEL")
	}()

	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}
	if cfg.APIPort != 9090 {
		t.Errorf("want APIPort=9090, got %d", cfg.APIPort)
	}
	if cfg.LogLevel != "debug" {
		t.Errorf("want LogLevel=debug, got %s", cfg.LogLevel)
	}
}

func TestLoad_InvalidPort(t *testing.T) {
	os.Setenv("API_PORT", "-1")
	defer os.Unsetenv("API_PORT")

	_, err := config.Load()
	if err == nil {
		t.Fatal("expected validation error for negative port, got nil")
	}
}

func TestLoad_BootstrapPeers(t *testing.T) {
	os.Setenv("P2P_BOOTSTRAP_PEERS", "/ip4/1.1.1.1/tcp/9000,/ip4/2.2.2.2/tcp/9001")
	defer os.Unsetenv("P2P_BOOTSTRAP_PEERS")

	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(cfg.P2PBootstrapPeers) != 2 {
		t.Errorf("want 2 bootstrap peers, got %d", len(cfg.P2PBootstrapPeers))
	}
}
