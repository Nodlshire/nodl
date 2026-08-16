package dewi

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
	"time"
)

// FrequencyBandSpec defines the RF boundaries for a capability model.
type FrequencyBandSpec struct {
	FreqMinHz   int64   `json:"freqMinHz"`
	FreqMaxHz   int64   `json:"freqMaxHz"`
	MaxPowerDbm int     `json:"maxPowerDbm"`
	DutyCycle   float64 `json:"dutyCycle"`
}

// AdapterCapabilityModel defines the deterministic hardware & protocol capabilities.
type AdapterCapabilityModel struct {
	AdapterID       string              `json:"adapterId"`
	Protocol        string              `json:"protocol"`
	Bands           []FrequencyBandSpec `json:"bands"`
	Modulations     []string            `json:"modulations"`
	TelemetryFields []string            `json:"telemetryFields"`
	HealthFields    []string            `json:"healthFields"`
	FirmwareVersion string              `json:"firmwareVersion"`
	HardwareRev     string              `json:"hardwareRev"`
	SerialNumber    string              `json:"serialNumber"`
	Timestamp       time.Time           `json:"timestamp"`
}

// NewDefaultCapabilityModel builds a normalized capability model for a given protocol.
func NewDefaultCapabilityModel(adapterID, protocol string) AdapterCapabilityModel {
	bands := []FrequencyBandSpec{
		{FreqMinHz: 863000000, FreqMaxHz: 870000000, MaxPowerDbm: 14, DutyCycle: 0.01},
	}
	mods := []string{"FSK", "LoRa"}
	telemetry := []string{"channel_utilization", "noise_floor_dbm", "rssi_dbm", "snr_db", "temperature_c", "voltage_mv"}
	health := []string{"error_code", "temperature_c", "voltage_mv"}

	sort.Strings(mods)
	sort.Strings(telemetry)
	sort.Strings(health)

	return AdapterCapabilityModel{
		AdapterID:       adapterID,
		Protocol:        protocol,
		Bands:           bands,
		Modulations:     mods,
		TelemetryFields: telemetry,
		HealthFields:    health,
		FirmwareVersion: "v1.4.2",
		HardwareRev:     "A3",
		SerialNumber:    fmt.Sprintf("SN-DEWI-%s-001", protocol),
		Timestamp:       time.Now().UTC(),
	}
}

// CanonicalBytes generates deterministic JSON serialization with ASCII key sorting.
func (c *AdapterCapabilityModel) CanonicalBytes() ([]byte, error) {
	bandsMap := make([]map[string]interface{}, 0, len(c.Bands))
	for _, b := range c.Bands {
		bandsMap = append(bandsMap, map[string]interface{}{
			"freqMinHz":   b.FreqMinHz,
			"freqMaxHz":   b.FreqMaxHz,
			"maxPowerDbm": b.MaxPowerDbm,
			"dutyCycle":   b.DutyCycle,
		})
	}

	canonical := map[string]interface{}{
		"adapterId":       c.AdapterID,
		"protocol":        c.Protocol,
		"bands":           bandsMap,
		"modulations":     c.Modulations,
		"telemetryFields": c.TelemetryFields,
		"healthFields":    c.HealthFields,
		"firmwareVersion": c.FirmwareVersion,
		"hardwareRev":     c.HardwareRev,
		"serialNumber":    c.SerialNumber,
		"timestamp":       c.Timestamp.Format(time.RFC3339),
	}

	keys := make([]string, 0, len(canonical))
	for k := range canonical {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	ordered := make([]byte, 0, 512)
	ordered = append(ordered, '{')
	for i, k := range keys {
		if i > 0 {
			ordered = append(ordered, ',')
		}
		keyBytes, _ := json.Marshal(k)
		valBytes, _ := json.Marshal(canonical[k])
		ordered = append(ordered, keyBytes...)
		ordered = append(ordered, ':')
		ordered = append(ordered, valBytes...)
	}
	ordered = append(ordered, '}')

	return ordered, nil
}

// CapabilityHash computes the deterministic SHA-256 hash of the canonical capability model.
func (c *AdapterCapabilityModel) CapabilityHash() (string, error) {
	bytes, err := c.CanonicalBytes()
	if err != nil {
		return "", err
	}
	hash := sha256.Sum256(bytes)
	return hex.EncodeToString(hash[:]), nil
}
