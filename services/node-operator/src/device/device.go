package device

import (
	"bytes"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

type NodeMetadata struct {
	OS        string  `json:"os"`
	Hostname  string  `json:"hostname,omitempty"`
	UserAgent string  `json:"userAgent,omitempty"`
	CPU       string  `json:"cpu,omitempty"`
	GPU       string  `json:"gpu,omitempty"`
	RAM       string  `json:"ram,omitempty"`
	Arch      string  `json:"arch,omitempty"`
	MachineID string  `json:"machineId,omitempty"`
	Lat       float64 `json:"lat,omitempty"`
	Lon       float64 `json:"lon,omitempty"`
	City      string  `json:"city,omitempty"`
}

type RegisterRequest struct {
	Metadata           NodeMetadata `json:"metadata"`
	HardwareHash       string       `json:"hardwareHash,omitempty"`
	BrowserFingerprint string       `json:"browserFingerprint,omitempty"`
	DeviceClass        string       `json:"deviceClass,omitempty"`
	Lat                float64      `json:"lat,omitempty"`
	Lon                float64      `json:"lon,omitempty"`
}

type RegisterResponse struct {
	DeviceToken string `json:"deviceToken"`
	Status      string `json:"status"`
	Error       string `json:"error,omitempty"`
}

// GetMachineID retrieves a stable hardware identifier per OS.
func GetMachineID() string {
	switch runtime.GOOS {
	case "linux":
		if b, err := os.ReadFile("/etc/machine-id"); err == nil {
			return strings.TrimSpace(string(b))
		}
		if b, err := os.ReadFile("/var/lib/dbus/machine-id"); err == nil {
			return strings.TrimSpace(string(b))
		}
	case "darwin":
		out, err := exec.Command("ioreg", "-rd1", "-c", "IOPlatformExpertDevice").Output()
		if err == nil {
			for _, line := range strings.Split(string(out), "\n") {
				if strings.Contains(line, "IOPlatformUUID") {
					parts := strings.Split(line, `"`)
					if len(parts) >= 4 {
						return parts[3]
					}
				}
			}
		}
	case "windows":
		out, err := exec.Command("cmd", "/c", "wmic csproduct get uuid").Output()
		if err == nil {
			lines := strings.Split(string(out), "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if line != "" && line != "UUID" {
					return line
				}
			}
		}
	}
	return ""
}

// ComputeHardwareHash creates a stable hardware SHA256 fingerprint.
func ComputeHardwareHash(meta NodeMetadata) string {
	h := sha256.New()
	h.Write([]byte(meta.OS))
	h.Write([]byte(meta.CPU))
	h.Write([]byte(meta.RAM))
	h.Write([]byte(meta.Hostname))
	h.Write([]byte(meta.MachineID))
	return hex.EncodeToString(h.Sum(nil))
}

// GenerateUUID generates a pseudo-uuid (v4-like) for the device without external dependencies.
func GenerateUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40 // Version 4
	b[8] = (b[8] & 0x3f) | 0x80 // Variant 10
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

// DetectGeo queries public IP geolocation endpoints with fallback.
func DetectGeo() (float64, float64, string) {
	client := &http.Client{Timeout: 4 * time.Second}
	resp, err := client.Get("https://ipapi.co/json/")
	if err != nil || resp.StatusCode != 200 {
		resp, err = client.Get("http://ip-api.com/json/")
	}
	if err != nil {
		return 0, 0, "Unknown"
	}
	defer resp.Body.Close()

	var geo struct {
		Lat     float64 `json:"latitude"`
		Lon     float64 `json:"longitude"`
		LatAlt  float64 `json:"lat"`
		LonAlt  float64 `json:"lon"`
		City    string  `json:"city"`
		Country string  `json:"country_name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return 0, 0, "Unknown"
	}

	finalLat := geo.Lat
	if finalLat == 0 {
		finalLat = geo.LatAlt
	}
	finalLon := geo.Lon
	if finalLon == 0 {
		finalLon = geo.LonAlt
	}

	return finalLat, finalLon, geo.City
}

// CollectMetadata gathers hardware information using stdlib and common OS files/commands.
func CollectMetadata() NodeMetadata {
	meta := NodeMetadata{
		OS:        runtime.GOOS,
		MachineID: GetMachineID(),
	}

	lat, lon, city := DetectGeo()
	meta.Lat = lat
	meta.Lon = lon
	meta.City = city

	if host, err := os.Hostname(); err == nil {
		meta.Hostname = host
	}
	
	meta.UserAgent = fmt.Sprintf("Wnode/Operator-0.1.0 (%s; %s)", runtime.GOOS, runtime.GOARCH)

	// Architecture from uname -m or GOARCH
	if out, err := exec.Command("uname", "-m").Output(); err == nil && len(strings.TrimSpace(string(out))) > 0 {
		meta.Arch = strings.TrimSpace(string(out))
	} else {
		meta.Arch = runtime.GOARCH
	}

	// CPU Cores
	meta.CPU = fmt.Sprintf("%d cores", runtime.NumCPU())

	if runtime.GOOS == "linux" {
		// Real OS Pretty Name from /etc/os-release
		if osData, err := os.ReadFile("/etc/os-release"); err == nil {
			for _, line := range strings.Split(string(osData), "\n") {
				if strings.HasPrefix(line, "PRETTY_NAME=") {
					pretty := strings.TrimPrefix(line, "PRETTY_NAME=")
					pretty = strings.Trim(pretty, "\"")
					if pretty != "" {
						meta.OS = pretty
					}
					break
				}
			}
		}

		// Real CPU Model Name from /proc/cpuinfo
		if out, err := os.ReadFile("/proc/cpuinfo"); err == nil {
			for _, line := range strings.Split(string(out), "\n") {
				if strings.HasPrefix(line, "model name") {
					parts := strings.Split(line, ":")
					if len(parts) == 2 {
						meta.CPU = fmt.Sprintf("%s (%d cores)", strings.TrimSpace(parts[1]), runtime.NumCPU())
						break
					}
				}
			}
		}

		// Real RAM Total from /proc/meminfo
		if out, err := os.ReadFile("/proc/meminfo"); err == nil {
			for _, line := range strings.Split(string(out), "\n") {
				if strings.HasPrefix(line, "MemTotal:") {
					fields := strings.Fields(line)
					if len(fields) >= 2 {
						kb := 0
						fmt.Sscanf(fields[1], "%d", &kb)
						if kb > 0 {
							gb := float64(kb) / (1024 * 1024)
							meta.RAM = fmt.Sprintf("%.1f GB", gb)
						}
					}
					break
				}
			}
		}

		// Real GPU Model
		if gpu := DetectGPU(); gpu != nil && gpu.Model != "" {
			meta.GPU = gpu.Model
		}

	} else if runtime.GOOS == "darwin" {
		if out, err := exec.Command("sysctl", "-n", "machdep.cpu.brand_string").Output(); err == nil {
			meta.CPU = fmt.Sprintf("%s (%d cores)", strings.TrimSpace(string(out)), runtime.NumCPU())
		}
		
		if out, err := exec.Command("sysctl", "-n", "hw.memsize").Output(); err == nil {
			bytes := 0
			fmt.Sscanf(strings.TrimSpace(string(out)), "%d", &bytes)
			if bytes > 0 {
				meta.RAM = fmt.Sprintf("%.1f GB", float64(bytes)/(1024*1024*1024))
			}
		}

		if gpu := DetectGPU(); gpu != nil && gpu.Model != "" {
			meta.GPU = gpu.Model
		}
	}

	return meta
}

// Register sends the device metadata to Mesh and retrieves a device token and node ID.
func Register(apiBase string, state *platform.State) error {
	if state.SessionToken == "" {
		return fmt.Errorf("not authenticated. Please run with --login first")
	}

	meta := CollectMetadata()
	platform.Info("Collected metadata: OS=%s, CPU=%s, RAM=%s, Lat=%.4f, Lon=%.4f", meta.OS, meta.CPU, meta.RAM, meta.Lat, meta.Lon)

	if state.DeviceUUID == "" {
		state.DeviceUUID = GenerateUUID()
	}

	reqBody := RegisterRequest{
		Metadata:     meta,
		HardwareHash: ComputeHardwareHash(meta),
		DeviceClass:  "native",
		Lat:          meta.Lat,
		Lon:          meta.Lon,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("%s/api/cmd/node/register", strings.TrimRight(apiBase, "/"))
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	
	// Add the session cookie for authentication
	req.AddCookie(&http.Cookie{
		Name:  "nodlr_session",
		Value: state.SessionToken,
	})

	platform.Info("Registering device with CMD API: %s", url)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("network error during registration: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		var errResp RegisterResponse
		if err := json.Unmarshal(bodyBytes, &errResp); err == nil && errResp.Error != "" {
			return fmt.Errorf("registration failed: %s (status %d)", errResp.Error, resp.StatusCode)
		}
		return fmt.Errorf("registration failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	// We create an anonymous struct to parse the extra HeartbeatOffset field
	var successResp struct {
		DeviceToken     string `json:"deviceToken"`
		Status          string `json:"status"`
		HeartbeatOffset int    `json:"heartbeatOffset"`
	}
	
	if err := json.Unmarshal(bodyBytes, &successResp); err != nil {
		return fmt.Errorf("failed to parse successful response: %w", err)
	}

	if successResp.DeviceToken == "" {
		return fmt.Errorf("server did not return a deviceToken")
	}

	state.DeviceToken = successResp.DeviceToken
	state.HeartbeatOffset = successResp.HeartbeatOffset
	state.HeartbeatInterval = 30 // default 30 secs
	state.RegisteredAt = time.Now().UTC().Format(time.RFC3339)

	if err := platform.SaveState(state); err != nil {
		return fmt.Errorf("failed to save state: %w", err)
	}

	platform.Info("Device registered successfully.")
	return nil
}
