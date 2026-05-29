package device

import (
	"os/exec"
	"runtime"
	"strings"
	"strconv"
	"path/filepath"
	"os"
)

// DetectGPU identifies the primary GPU using OS-native methods without CGO or external libraries.
func DetectGPU() *GPUInfo {
	switch runtime.GOOS {
	case "linux":
		return detectGPULinux()
	case "darwin":
		return detectGPUMacOS()
	case "windows":
		return detectGPUWindows()
	}
	return nil
}

func detectGPULinux() *GPUInfo {
	// Try NVIDIA first via procfs
	matches, err := filepath.Glob("/proc/driver/nvidia/gpus/*/information")
	if err == nil && len(matches) > 0 {
		data, err := os.ReadFile(matches[0])
		if err == nil {
			info := &GPUInfo{Vendor: "NVIDIA", VramMB: 0}
			lines := strings.Split(string(data), "\n")
			for _, line := range lines {
				if strings.HasPrefix(line, "Model:") {
					info.Model = strings.TrimSpace(strings.TrimPrefix(line, "Model:"))
				}
			}
			return info
		}
	}
	
	// Fallback to sysfs DRM for AMD/Intel
	drmMatches, err := filepath.Glob("/sys/class/drm/card0/device/vendor")
	if err == nil && len(drmMatches) > 0 {
		vendorData, _ := os.ReadFile(drmMatches[0])
		vendorID := strings.TrimSpace(string(vendorData))
		
		info := &GPUInfo{VramMB: 0}
		switch vendorID {
		case "0x10de":
			info.Vendor = "NVIDIA"
		case "0x1002":
			info.Vendor = "AMD"
		case "0x8086":
			info.Vendor = "Intel"
		default:
			info.Vendor = "Unknown"
		}
		
		// Attempt to read sysfs config for basic naming if possible, but sysfs names are cryptic.
		info.Model = "Generic Compute Node"
		return info
	}

	return nil
}

func detectGPUMacOS() *GPUInfo {
	out, err := exec.Command("system_profiler", "SPDisplaysDataType").Output()
	if err != nil {
		return nil
	}

	info := &GPUInfo{}
	lines := strings.Split(string(out), "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "Chipset Model:") {
			info.Model = strings.TrimSpace(strings.TrimPrefix(line, "Chipset Model:"))
			
			if strings.Contains(strings.ToLower(info.Model), "apple") {
				info.Vendor = "Apple"
			} else if strings.Contains(strings.ToLower(info.Model), "amd") || strings.Contains(strings.ToLower(info.Model), "radeon") {
				info.Vendor = "AMD"
			} else if strings.Contains(strings.ToLower(info.Model), "intel") {
				info.Vendor = "Intel"
			}
		} else if strings.HasPrefix(line, "VRAM (Total):") {
			vramStr := strings.TrimSpace(strings.TrimPrefix(line, "VRAM (Total):"))
			// e.g., "8 GB" or "1536 MB"
			parts := strings.Fields(vramStr)
			if len(parts) >= 2 {
				val, _ := strconv.Atoi(parts[0])
				if strings.ToUpper(parts[1]) == "GB" {
					info.VramMB = val * 1024
				} else if strings.ToUpper(parts[1]) == "MB" {
					info.VramMB = val
				}
			}
		}
	}

	if info.Model != "" {
		if info.Vendor == "" {
			info.Vendor = "Apple" // Default to Apple Silicon unified memory
		}
		return info
	}
	return nil
}

func detectGPUWindows() *GPUInfo {
	out, err := exec.Command("wmic", "path", "win32_VideoController", "get", "Name,AdapterRAM").Output()
	if err != nil {
		return nil
	}
	
	// Output looks like:
	// AdapterRAM  Name
	// 1073741824  NVIDIA GeForce RTX 3080
	lines := strings.Split(strings.ReplaceAll(string(out), "\r\n", "\n"), "\n")
	
	if len(lines) >= 2 {
		fields := strings.Fields(lines[1])
		if len(fields) >= 2 {
			info := &GPUInfo{}
			
			ramBytes, _ := strconv.ParseInt(fields[0], 10, 64)
			info.VramMB = int(ramBytes / (1024 * 1024))
			
			info.Model = strings.Join(fields[1:], " ")
			
			upperModel := strings.ToUpper(info.Model)
			if strings.Contains(upperModel, "NVIDIA") {
				info.Vendor = "NVIDIA"
			} else if strings.Contains(upperModel, "AMD") || strings.Contains(upperModel, "RADEON") {
				info.Vendor = "AMD"
			} else if strings.Contains(upperModel, "INTEL") {
				info.Vendor = "Intel"
			} else {
				info.Vendor = "Unknown"
			}
			
			return info
		}
	}

	return nil
}
