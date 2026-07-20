#!/bin/bash
patch /home/obregan/Documents/nodl/node-operator/src/device/device.go << 'PATCH'
--- node-operator/src/device/device.go
+++ node-operator/src/device/device.go
@@ -25,6 +25,7 @@
 	CPU       string `json:"cpu,omitempty"`
 	GPU       string `json:"gpu,omitempty"`
 	RAM       string `json:"ram,omitempty"`
+	MachineID string `json:"machineId,omitempty"`
 }
 
 type RegisterRequest struct {
@@ -39,6 +40,38 @@
 	Error       string `json:"error,omitempty"`
 }
 
+func GetMachineID() string {
+	switch runtime.GOOS {
+	case "linux":
+		if b, err := os.ReadFile("/etc/machine-id"); err == nil {
+			return strings.TrimSpace(string(b))
+		}
+		if b, err := os.ReadFile("/var/lib/dbus/machine-id"); err == nil {
+			return strings.TrimSpace(string(b))
+		}
+	case "darwin":
+		out, err := exec.Command("ioreg", "-rd1", "-c", "IOPlatformExpertDevice").Output()
+		if err == nil {
+			for _, line := range strings.Split(string(out), "\n") {
+				if strings.Contains(line, "IOPlatformUUID") {
+					parts := strings.Split(line, "\"")
+					if len(parts) >= 4 {
+						return parts[3]
+					}
+				}
+			}
+		}
+	case "windows":
+		out, err := exec.Command("cmd", "/c", "wmic csproduct get uuid").Output()
+		if err == nil {
+			lines := strings.Split(string(out), "\n")
+			for _, line := range lines {
+				line = strings.TrimSpace(line)
+				if line != "" && line != "UUID" {
+					return line
+				}
+			}
+		}
+	}
+	return ""
+}
+
 // ComputeHardwareHash creates a stable hardware SHA256 fingerprint.
 func ComputeHardwareHash(meta NodeMetadata) string {
 	h := sha256.New()
@@ -46,6 +79,7 @@
 	h.Write([]byte(meta.CPU))
 	h.Write([]byte(meta.RAM))
 	h.Write([]byte(meta.Hostname))
+	h.Write([]byte(meta.MachineID))
 	return hex.EncodeToString(h.Sum(nil))
 }
 
@@ -62,6 +96,7 @@
 func CollectMetadata() NodeMetadata {
 	meta := NodeMetadata{
 		OS: runtime.GOOS,
+		MachineID: GetMachineID(),
 	}
 
 	if host, err := os.Hostname(); err == nil {
PATCH
