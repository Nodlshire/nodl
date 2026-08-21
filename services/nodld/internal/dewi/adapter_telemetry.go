package dewi

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"math"
	"sort"
	"time"
)

// CanonicalTelemetry represents a normalized, deterministic RF telemetry object.
type CanonicalTelemetry struct {
	AdapterID          string    `json:"adapterId"`
	NodeID             string    `json:"nodeId"`
	Timestamp          time.Time `json:"timestamp"`
	FrequencyHz        int64     `json:"frequencyHz"`
	BandwidthHz        int64     `json:"bandwidthHz"`
	Modulation         string    `json:"modulation"`
	RSSIdBm            int       `json:"rssiDbm"`
	SNRdB              float64   `json:"snrDb"`              // Fixed 1 decimal place
	NoiseFloordBm      int       `json:"noiseFloorDbm"`
	ChannelUtilization float64   `json:"channelUtilization"` // Fixed 3 decimal places
	DutyCycle          float64   `json:"dutyCycle"`          // Fixed 3 decimal places
	TemperatureC       int       `json:"temperatureC"`
	VoltageMV          int       `json:"voltageMv"`
	ErrorCode          int       `json:"errorCode"`
}

// TelemetryNormalizationEngine (TSE) normalizes raw hardware fields into canonical schema.
type TelemetryNormalizationEngine struct{}

// NewTelemetryNormalizationEngine creates a TSE instance.
func NewTelemetryNormalizationEngine() *TelemetryNormalizationEngine {
	return &TelemetryNormalizationEngine{}
}

// RoundFloat rounds a float64 to a specified number of decimal places for determinism.
func RoundFloat(val float64, decimals int) float64 {
	pow := math.Pow(10, float64(decimals))
	return math.Round(val*pow) / pow
}

// Normalize transforms raw measurements into a CanonicalTelemetry struct.
func (tse *TelemetryNormalizationEngine) Normalize(adapterID, nodeID, modulation string, freqHz, bwHz int64, rssiDbm int, rawSNR float64, noiseFloorDbm int, rawChanUtil, rawDutyCycle float64, tempC, voltMv, errCode int) CanonicalTelemetry {
	return CanonicalTelemetry{
		AdapterID:          adapterID,
		NodeID:             nodeID,
		Timestamp:          time.Now().UTC(),
		FrequencyHz:        freqHz,
		BandwidthHz:        bwHz,
		Modulation:         modulation,
		RSSIdBm:            rssiDbm,
		SNRdB:              RoundFloat(rawSNR, 1),
		NoiseFloordBm:      noiseFloorDbm,
		ChannelUtilization: RoundFloat(rawChanUtil, 3),
		DutyCycle:          RoundFloat(rawDutyCycle, 3),
		TemperatureC:       tempC,
		VoltageMV:          voltMv,
		ErrorCode:          errCode,
	}
}

// CanonicalBytes produces ASCII key-sorted JSON for hashing.
func (ct *CanonicalTelemetry) CanonicalBytes() ([]byte, error) {
	canonical := map[string]interface{}{
		"adapterId":          ct.AdapterID,
		"nodeId":             ct.NodeID,
		"timestamp":          ct.Timestamp.Format(time.RFC3339),
		"frequencyHz":        ct.FrequencyHz,
		"bandwidthHz":        ct.BandwidthHz,
		"modulation":         ct.Modulation,
		"rssiDbm":            ct.RSSIdBm,
		"snrDb":              ct.SNRdB,
		"noiseFloorDbm":      ct.NoiseFloordBm,
		"channelUtilization": ct.ChannelUtilization,
		"dutyCycle":          ct.DutyCycle,
		"temperatureC":       ct.TemperatureC,
		"voltageMv":          ct.VoltageMV,
		"errorCode":          ct.ErrorCode,
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

// TelemetryHash computes the SHA-256 hash of the canonical telemetry object.
func (ct *CanonicalTelemetry) TelemetryHash() (string, error) {
	bytes, err := ct.CanonicalBytes()
	if err != nil {
		return "", err
	}
	hash := sha256.Sum256(bytes)
	return hex.EncodeToString(hash[:]), nil
}
