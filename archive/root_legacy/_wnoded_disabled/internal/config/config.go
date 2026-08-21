// Package config handles environment variable loading and typed configuration
// for the nodld daemon.
package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration for nodld.
type Config struct {
	// API server listen port
	APIPort int

	// libp2p listen port
	P2PPort int

	// Bootstrap peer multiaddrs (comma-separated in env)
	P2PBootstrapPeers []string

	// Stripe credentials
	StripeSecretKey        string
	StripeWebhookSecret    string
	StripePlatformAccount  string

	// Redis URL for optional persistent job queue
	RedisURL string

	// Log level: debug | info | warn | error
	LogLevel string
}

// Load reads from a .env file (if present) and then from the environment.
// Environment variables always override .env values.
func Load() (*Config, error) {
	// Best-effort load of .env — ignore error if file doesn't exist
	_ = godotenv.Load()

	cfg := &Config{
		APIPort:               getEnvInt("API_PORT", 8080),
		P2PPort:               getEnvInt("P2P_PORT", 9000),
		P2PBootstrapPeers:     getEnvSlice("P2P_BOOTSTRAP_PEERS", ","),
		StripeSecretKey:       getEnv("STRIPE_SECRET_KEY", ""),
		StripeWebhookSecret:   getEnv("STRIPE_WEBHOOK_SECRET", ""),
		StripePlatformAccount: getEnv("STRIPE_PLATFORM_ACCOUNT_ID", ""),
		RedisURL:              getEnv("REDIS_URL", "redis://127.0.0.1:6379"),
		LogLevel:              getEnv("LOG_LEVEL", "info"),
	}

	if err := cfg.validate(); err != nil {
		return nil, fmt.Errorf("config validation failed: %w", err)
	}

	return cfg, nil
}

// validate checks required fields are present for production operation.
// Missing Stripe keys are allowed (stubbed) to support local dev without keys.
func (c *Config) validate() error {
	if c.APIPort <= 0 || c.APIPort > 65535 {
		return fmt.Errorf("API_PORT must be between 1 and 65535, got %d", c.APIPort)
	}
	if c.P2PPort <= 0 || c.P2PPort > 65535 {
		return fmt.Errorf("P2P_PORT must be between 1 and 65535, got %d", c.P2PPort)
	}
	return nil
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	s := getEnv(key, "")
	if s == "" {
		return fallback
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return fallback
	}
	return v
}

func getEnvSlice(key, sep string) []string {
	s := getEnv(key, "")
	if s == "" {
		return []string{}
	}
	parts := strings.Split(s, sep)
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		if trimmed := strings.TrimSpace(p); trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
