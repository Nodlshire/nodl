package dewi

import (
	"os"
	"testing"
)

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()
	if cfg == nil {
		t.Fatal("DefaultConfig returned nil")
	}
	if !cfg.DeWi.Enabled {
		t.Error("expected DeWi.Enabled to be true by default")
	}
	if cfg.DeWi.OperatorID == "" {
		t.Error("expected default OperatorID")
	}
	if err := cfg.Validate(); err != nil {
		t.Errorf("DefaultConfig failed validation: %v", err)
	}
}

func TestLoadConfig_NonExistentFile(t *testing.T) {
	cfg, err := LoadConfig("non_existent_config.yaml")
	if err != nil {
		t.Fatalf("expected fallback to default config, got error: %v", err)
	}
	if cfg == nil {
		t.Fatal("expected non-nil config")
	}
}

func TestLoadConfig_ValidYAML(t *testing.T) {
	tmpFile, err := os.CreateTemp("", "dewi_test_*.yaml")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(tmpFile.Name())

	yamlData := `
dewi:
  enabled: true
  operator_id: "test-operator-123"
  adapters:
    reticulum:
      enabled: true
      listen_tcp: 5001
`
	if _, err := tmpFile.WriteString(yamlData); err != nil {
		t.Fatal(err)
	}
	tmpFile.Close()

	cfg, err := LoadConfig(tmpFile.Name())
	if err != nil {
		t.Fatalf("failed to load valid config: %v", err)
	}

	if cfg.DeWi.OperatorID != "test-operator-123" {
		t.Errorf("expected operator_id test-operator-123, got %s", cfg.DeWi.OperatorID)
	}
	if cfg.DeWi.Adapters.Reticulum.ListenTCP != 5001 {
		t.Errorf("expected Reticulum ListenTCP 5001, got %d", cfg.DeWi.Adapters.Reticulum.ListenTCP)
	}
}
