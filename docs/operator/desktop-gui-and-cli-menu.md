# Desktop GUI Applet, Desktop Launcher & Headless Daemon Guide

This guide details the three deployment modes of the Wnode Node Operator software suite: the **Out-of-the-Box Desktop Applet & Desktop Launcher**, the **Interactive Terminal CLI Mode**, and the **Unassisted Headless Background Daemon (`nodld`)**.

---

![Wnode Node Operator Desktop GUI & Interactive Terminal Interface](/diagrams/operator_cli_desktop_interface.png)

---

## 1. Desktop Application Mode (Windows, macOS & Linux)

For desktop environments (Fedora, Ubuntu, Debian, Arch Linux, macOS, Windows 10/11), the Node Operator operates as a standalone desktop application with zero terminal complexity required.

### Linux Application Launcher & Desktop Icon Setup

Running the application once automatically creates a native `.desktop` application menu launcher in `~/.local/share/applications/wnode-node-operator.desktop` and a shortcut on your Desktop:

```bash
curl -fsSL https://raw.githubusercontent.com/wnodeltd/wnode/main/apps/web/public/downloads/wnode-node-operator -o wnode-node-operator && chmod +x wnode-node-operator && ./wnode-node-operator
```

#### Key Desktop App Features
- **Application Folder & Taskbar Integration**: Access **Wnode Node Operator** directly from your GNOME App Grid, KDE Launcher, or Fedora Taskbar.
- **Smart Idle Sensing**: Automatically pauses compute tasks when mouse or keyboard activity is detected, maintaining zero latency during gaming or productivity.
- **Custom Active Hours**: Configure custom work/rest schedules (e.g., execute workloads overnight between 11 PM – 7 AM).

---

## 2. Linux Compute Node (Interactive CLI Mode)

For terminal users and remote Linux workstations, running the operator in interactive CLI mode provides real-time telemetry streaming and token configuration:

```bash
./wnode-node-operator --token=WNODE-AUTH-YOUR_ACCOUNT_TOKEN
```

---

## 3. Headless Background Daemon Setup (Debian, Ubuntu, Fedora, Arch, Alpine, ARM64, macOS, Windows)

For headless servers, remote SSH instances, or production clusters, the compiled Go daemon (`nodld`) runs as an unassisted background service without GUI overhead.

### Distribution Installation Commands

| OS Environment | Target Architecture | Service Installation Command |
| :--- | :--- | :--- |
| **Debian 11 / 12 (Bookworm)** | `x86_64` | `curl -s https://nodlr.wnode.one/install/linux.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **Ubuntu 22.04 / 24.04 LTS** | `x86_64` | `curl -s https://nodlr.wnode.one/install/linux.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **Fedora / RHEL / CentOS** | `x86_64` | `curl -s https://nodlr.wnode.one/install/linux.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **Arch Linux / Manjaro** | `x86_64` | `curl -s https://nodlr.wnode.one/install/linux.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **Linux ARM64 / RPi 4/5** | `aarch64` | `curl -s https://nodlr.wnode.one/install/linux.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **macOS Headless Daemon** | `Apple / Intel` | `curl -s https://nodlr.wnode.one/install/mac.sh | bash -s -- WNODE-AUTH-TOKEN` |
| **Windows Headless Service** | `x86_64` | `iwr -useb https://github.com/wnodeltd/wnode/releases/download/v1.0.0/nodl-core-windows-amd64.exe -OutFile nodl-core.exe; .\nodl-core.exe daemon --token=WNODE-AUTH-TOKEN` |

---

## 4. CLI & Daemon Command Reference Table

| Command | Operational Scope | Description & Primary Purpose |
| :--- | :--- | :--- |
| **`nodld status`** | Telemetry Inspection | Displays real-time connection state, H3 spatial index, WorkScore, and active workloads. |
| **`nodld logs`** | System Diagnostics | Tails live background daemon execution, P2P mesh discovery, and workload logs. |
| **`nodld restart`** | Process Control | Restarts the background daemon service and reconnects to the DeWi mesh network. |
| **`nodld stop`** | Process Control | Gracefully halts background daemon execution and releases network ports. |
| **`./wnode-node-operator --help`** | Help & Flags | Displays interactive CLI menu, configuration flags, and custom token pairing parameters. |

