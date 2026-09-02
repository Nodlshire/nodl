# 04 Node Operator Automated Upgrades — Wnode Enterprise Documentation v1.5.0

> **Canonical Protocol Specification**: Single Source of Truth (SOT) for 04 Node Operator Automated Upgrades. Native Go runtime compliance on port 8080.

## 1. Overview & Operational Principles

The Wnode Sovereign Compute Mesh provides an automated, in-place self-updating engine for Node Operator binaries (`nodl-core` and `nodl-desktop`). Operators are never required to manually stop background system daemons, alter file permissions, or replace binaries on disk.

The upgrade mechanism operates deterministically through the canonical Release Manifest endpoint (`https://nodlr.wnode.one/releases/manifest.json`).

## 2. In-Place Self-Updating Engine Architecture

Directory: `services/node-operator/core/updater/updater.go`

- **Version Discovery (`CheckForUpdate`)**:
  Queries `https://nodlr.wnode.one/releases/manifest.json` for target platform key (`windows-amd64`, `linux-amd64`, `darwin-arm64`). Compares version strings.
- **SHA-256 Checksum Validation (`ApplyUpdate`)**:
  Downloads binary stream into `<execPath>.tmp`. Computes SHA-256 hash and verifies against manifest checksum.
- **Platform In-Place Self-Replacement**:
  - **Linux / macOS**: Atomic replacement using `os.Chmod(tmpPath, 0755)` and `os.Rename(tmpPath, execPath)`.
  - **Windows**: Renames running `.exe` to `.old`, writes new `.exe` to original path, and schedules asynchronous `.old` file deletion.
- **Process Restart (`RestartSelf`)**:
  Spawns new process instance with original CLI flags and terminates legacy process.

## 3. Provider Dashboard Control Panel Integration

Local HTTP Control Panel (`http://127.0.0.1:45975`):
- `GET /api/status`: Exposes `update_available`, `new_version`, and `download_url`.
- `POST /api/upgrade`: Triggers in-place download, verification, and self-restart.
- **Webview UI**: Displays an interactive **"Update to v1.0.1 Available"** banner with a 1-click **Update & Restart** button.

## 4. Release Manifest Specification

Endpoint: `https://nodlr.wnode.one/releases/manifest.json`

```json
{
  "version": "1.0.1",
  "min_required_version": "1.0.0",
  "releases": {
    "windows-amd64": {
      "url": "https://nodlr.wnode.one/releases/nodl-desktop-windows-amd64.exe",
      "sha256": "4dc57e1a9bb170a08a25e77781197bd356893a9d242f7021a5485859a3de7c6f"
    },
    "linux-amd64": {
      "url": "https://nodlr.wnode.one/releases/nodl-desktop-linux-amd64",
      "sha256": "50a06886afe72bdf369383195121c272f5d5964c4ce482f0bd8932903580f9f3"
    },
    "darwin-arm64": {
      "url": "https://nodlr.wnode.one/releases/nodl-desktop-darwin-arm64",
      "sha256": "eaefd427c03529ce3532e8712d00adbb16bd299fc3ce09ac56824a77fa040560"
    }
  }
}
```
