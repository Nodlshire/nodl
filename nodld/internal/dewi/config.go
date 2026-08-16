package dewi

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Config represents the top-level dewi.yaml configuration structure.
type Config struct {
	DeWi DeWiConfig `yaml:"dewi"`
}

type DeWiConfig struct {
	Enabled        bool           `yaml:"enabled"`
	OperatorID     string         `yaml:"operator_id"`
	SigningKeyPath string         `yaml:"signing_key_path"`
	TX             TXConfig       `yaml:"tx"`
	Adapters       AdaptersConfig `yaml:"adapters"`
	Metrics        MetricsConfig  `yaml:"metrics"`
}

type TXConfig struct {
	Enabled                  bool   `yaml:"enabled"`
	OperatorApprovalRequired bool   `yaml:"operator_approval_required"`
	ApprovalRecordPath       string `yaml:"approval_record_path"`
	Jurisdiction             string `yaml:"jurisdiction"`
	MaxTxPerMinute           int    `yaml:"max_tx_per_minute"`
	MaxTxBytesPerDay         int64  `yaml:"max_tx_bytes_per_day"`
}

type AdapterTXConfig struct {
	Enabled        bool `yaml:"enabled"`
	MaxTxPerMinute int  `yaml:"max_tx_per_minute"`
}

type AdaptersConfig struct {
	Reticulum  ReticulumConfig  `yaml:"reticulum"`
	Meshtastic MeshtasticConfig `yaml:"meshtastic"`
	LoRaWAN    LoRaWANConfig    `yaml:"lorawan"`
	APRS       APRSConfig       `yaml:"aprs"`
}

type ReticulumConfig struct {
	Enabled          bool            `yaml:"enabled"`
	ListenTCP        int             `yaml:"listen_tcp"`
	ListenWS         int             `yaml:"listen_ws"`
	MaxConnections   int             `yaml:"max_connections"`
	AnnounceInterval int             `yaml:"announce_interval"`
	PersistencePath  string          `yaml:"persistence_path"`
	TX               AdapterTXConfig `yaml:"tx"`
}

type MeshtasticConfig struct {
	Enabled                  bool            `yaml:"enabled"`
	SerialPorts              []string        `yaml:"serial_ports"`
	Baud                     int             `yaml:"baud"`
	ReconnectIntervalSeconds int             `yaml:"reconnect_interval_seconds"`
	TX                       AdapterTXConfig `yaml:"tx"`
}

type LoRaWANConfig struct {
	Enabled        bool            `yaml:"enabled"`
	SemtechUDPPort int             `yaml:"semtech_udp_port"`
	MQTT           MQTTConfig      `yaml:"mqtt"`
	TX             AdapterTXConfig `yaml:"tx"`
}

type MQTTConfig struct {
	Enabled bool   `yaml:"enabled"`
	Broker  string `yaml:"broker"`
}

type APRSConfig struct {
	Enabled   bool            `yaml:"enabled"`
	TNCSerial string          `yaml:"tnc_serial"`
	Baud      int             `yaml:"baud"`
	TX        AdapterTXConfig `yaml:"tx"`
}

type MetricsConfig struct {
	PrometheusEnabled bool   `yaml:"prometheus_enabled"`
	ListenAddr        string `yaml:"listen_addr"`
}

// DefaultConfig returns reasonable defaults for DeWi adapters.
func DefaultConfig() *Config {
	return &Config{
		DeWi: DeWiConfig{
			Enabled:        true,
			OperatorID:     "operator-default",
			SigningKeyPath: "state/operator.ed25519",
			TX: TXConfig{
				Enabled:                  false, // Disabled by default
				OperatorApprovalRequired: true,
				ApprovalRecordPath:       "/tmp/ui-core-migration/reports/tx_approvals",
				Jurisdiction:             "US-FCC-PART15",
				MaxTxPerMinute:           10,
				MaxTxBytesPerDay:         10485760, // 10MB
			},
			Adapters: AdaptersConfig{
				Reticulum: ReticulumConfig{
					Enabled:          true,
					ListenTCP:        4001,
					ListenWS:         4002,
					MaxConnections:   100,
					AnnounceInterval: 3600,
					PersistencePath:  "state/reticulum",
					TX:               AdapterTXConfig{Enabled: false, MaxTxPerMinute: 5},
				},
				Meshtastic: MeshtasticConfig{
					Enabled:                  true,
					SerialPorts:              []string{"/dev/ttyUSB0", "/dev/ttyACM0"},
					Baud:                     115200,
					ReconnectIntervalSeconds: 10,
					TX:                       AdapterTXConfig{Enabled: false, MaxTxPerMinute: 5},
				},
				LoRaWAN: LoRaWANConfig{
					Enabled:        true,
					SemtechUDPPort: 1700,
					MQTT: MQTTConfig{
						Enabled: false,
						Broker:  "tcp://localhost:1883",
					},
					TX: AdapterTXConfig{Enabled: false, MaxTxPerMinute: 5},
				},
				APRS: APRSConfig{
					Enabled:   false,
					TNCSerial: "/dev/ttyS1",
					Baud:      9600,
					TX:        AdapterTXConfig{Enabled: false, MaxTxPerMinute: 2},
				},
			},
			Metrics: MetricsConfig{
				PrometheusEnabled: true,
				ListenAddr:        ":9100",
			},
		},
	}
}

// LoadConfig loads and parses a dewi.yaml file. If the file does not exist, returns DefaultConfig.
func LoadConfig(path string) (*Config, error) {
	if path == "" {
		path = "dewi.yaml"
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return DefaultConfig(), nil
		}
		return nil, fmt.Errorf("failed to read dewi config file: %w", err)
	}

	cfg := DefaultConfig()
	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("failed to parse dewi config YAML: %w", err)
	}

	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid dewi config: %w", err)
	}

	return cfg, nil
}

// Validate validates the configuration.
func (c *Config) Validate() error {
	if !c.DeWi.Enabled {
		return nil
	}
	if c.DeWi.OperatorID == "" {
		return fmt.Errorf("dewi.operator_id cannot be empty")
	}
	return nil
}
