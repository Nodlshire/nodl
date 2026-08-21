# Wnode Sovereign Compute Mesh — GUI & Desktop Operator Guide

**Version**: 1.7  
**Author**: Wnode Engineering Team & Protocol Architecture Group  
**Target Audience**: Node Operators, System Integrators, Infrastructure Engineers  

---

## 1. Executive Summary & Architecture

The **Wnode Standalone Desktop Operator** is a lightweight, RAM-isolated native compute node designed to run continuously in the background on desktop and workstation operating systems (Linux, macOS, Windows). 

Unlike legacy browser-extension operators, the Wnode GUI Operator runs as a **standalone native desktop application** with system tray status monitoring, application launcher shortcuts, and automatic system startup capabilities.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DESKTOP SYSTEM ENVIRONMENT                         │
│                                                                         │
│   ┌───────────────────────────┐      ┌──────────────────────────────┐   │
│   │ Application Launcher      │      │ Top-Bar / System Tray        │   │
│   │ (.desktop / Start Menu)   │      │ Status & Controls            │   │
│   └─────────────┬─────────────┘      └──────────────┬───────────────┘   │
│                 │                                   │                   │
│                 ▼                                   ▼                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │              Wnode Standalone Native Control Window             │   │
│   │              (Webview Standalone GUI Component)                 │   │
│   └──────────────────────────────┬──────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │              Wnode Native RAM-Isolated Worker Engine            │   │
│   │              (Telemetry, Heartbeats, Task Dispatch)             │   │
│   └──────────────────────────────┬──────────────────────────────────┘   │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │ HTTPS / TLS (mTLS)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 WNODE SOVEREIGN MESH ORCHESTRATOR                       │
│                 (api.wnode.one / nodlr.wnode.one)                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Desktop Feature Matrix

| Feature | Description | Implementation |
| :--- | :--- | :--- |
| **Standalone Window** | Renders as a dedicated desktop application (no Chrome tabs or browser chrome). | Native Webview Wrapper (`--class=wnode-operator`) |
| **System Tray Status** | Real-time status indicator in top panel (`Online & Transmitting`, `Paused`, `Unpaired`). | Native Desktop Tray Protocol |
| **Background Persistence** | Closing the window hides to tray while telemetry continues running. | Background Process Daemon |
| **App Menu Launcher** | Desktop shortcut and application menu launcher integration. | `.desktop` / Start Menu / LaunchAgents |
| **Workload Scheduler** | Custom execution time windows (e.g. 08:00–22:00 compute schedule). | Local Compute Scheduler |

---

## 3. Installation & Setup Instructions

### A. Linux (Fedora, Ubuntu, Debian, Arch)

To install the Standalone GUI Operator on Linux, run the following command in terminal:

```bash
curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-desktop-linux-amd64 -o nodl-desktop \
  && chmod +x nodl-desktop \
  && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-desktop --token=WNODE-AUTH-YOUR-TOKEN-HERE
```

#### Application Shortcut & Autostart
Upon first launch, `nodl-desktop` automatically registers application shortcuts:
* **Application Launcher**: `~/.local/share/applications/wnode-operator.desktop`
* **Desktop Shortcut**: `~/Desktop/Wnode-Operator.desktop`
* **Autostart Service**: `~/.config/autostart/wnode-operator.desktop` & `~/.config/systemd/user/wnode-operator.service`

### B. macOS (Apple Silicon & Intel)

```bash
curl -L https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-desktop-darwin-arm64 -o nodl-desktop \
  && chmod +x nodl-desktop \
  && WNODE_API_BASE=https://nodlr.wnode.one ./nodl-desktop --token=WNODE-AUTH-YOUR-TOKEN-HERE
```

### C. Windows (x64)

Run the following command in PowerShell:

```powershell
iwr -useb https://github.com/wnodeltd/wnode/releases/download/v1.0.3/nodl-desktop-windows-amd64.exe -OutFile nodl-desktop.exe;
$env:WNODE_API_BASE='https://nodlr.wnode.one';
.\nodl-desktop.exe --token=WNODE-AUTH-YOUR-TOKEN-HERE
```

---

## 4. Operational Controls & Usage

1. **Pairing Account Token**:
   - Open the application and navigate to the **Node Identity & Pairing** card.
   - Paste your pairing token (`WNODE-AUTH-...` or `REG-...`) and click **Pair Operator**.

2. **System Tray Actions**:
   - **Clicking Tray Icon**: Brings the standalone GUI application window to the foreground.
   - **Right-Clicking Tray Icon**: Opens context menu (`Open Control Panel`, `Pause/Resume Schedule`, `Exit`).

3. **Workload Schedule Window**:
   - Enable **Compute Schedule Window** to restrict compute task execution to specific hours (e.g., overnight compute 22:00–06:00).

---

## 5. Troubleshooting & Diagnostics

> [!NOTE]
> If `Text file busy` occurs during upgrade, ensure the background process is terminated before overwriting the binary using `pkill -9 -f nodl-desktop`.

```bash
# Check running desktop process
ps aux | grep nodl-desktop

# Inspect user systemd service status
systemctl --user status wnode-operator

# Manually trigger GUI Control Panel
./nodl-desktop --port=28443
```
