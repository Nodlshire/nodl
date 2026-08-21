package platform

import (
	"os/exec"
	"runtime"
	"strings"
	"os"
)

// GetMachineUUID retrieves a stable hardware identifier for the local machine.
func GetMachineUUID() string {
	if runtime.GOOS == "linux" {
		// Try systemd machine-id first
		data, err := os.ReadFile("/etc/machine-id")
		if err == nil {
			return strings.TrimSpace(string(data))
		}
		// Fallback to dbus machine-id
		data, err = os.ReadFile("/var/lib/dbus/machine-id")
		if err == nil {
			return strings.TrimSpace(string(data))
		}
	} else if runtime.GOOS == "darwin" {
		out, err := exec.Command("ioreg", "-rd1", "-c", "IOPlatformExpertDevice").Output()
		if err == nil {
			lines := strings.Split(string(out), "\n")
			for _, line := range lines {
				if strings.Contains(line, "IOPlatformUUID") {
					parts := strings.Split(line, "=")
					if len(parts) == 2 {
						return strings.Trim(strings.TrimSpace(parts[1]), "\"")
					}
				}
			}
		}
	}
	
	// Fallback for unexpected systems, though not truly stable
	if hostname, err := os.Hostname(); err == nil {
		return "fallback-uuid-" + hostname
	}
	return "fallback-uuid-unknown"
}
