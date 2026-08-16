# Desktop GUI Applet & Interactive Terminal Menu Guide

This guide details the two execution modes of the Wnode Node Operator software suite: the **Out-of-the-Box Desktop GUI Applet (`nodld-gui`)** designed for non-technical desktop users, and the **Interactive Headless Terminal Menu (`./nodld menu`)** designed for server operators.

---

## 1. Desktop GUI Applet (`nodld-gui`) — Out-of-the-Box Mode

For desktop environments (Fedora 43, Ubuntu, Debian, Arch Linux), the Node Operator operates as a standard desktop application with zero terminal configuration required.

```
+-----------------------------------------------------------------------+
|                    WNODE DESKTOP CONTROL PANEL                        |
+-----------------------------------------------------------------------+
|  Status: 🟢 ONLINE & ACTIVE           [ POWER: ON ]                  |
|                                                                       |
|  [✓] Smart Idle Pause (Rest when mouse/keyboard is active)            |
|  [ ] Custom Work Schedule (Rest 09:00 - 17:00, Work 23:00 - 07:00)    |
|                                                                       |
|  System Vitals:                                                       |
|    - CPU Usage:     14.2%                                             |
|    - RAM Footprint: 42.8%                                             |
|    - H3 Spatial Hex: 88194ad2a3fffff (Resolution 8)                   |
|    - Total Earned:  $128.50 USD                                       |
+-----------------------------------------------------------------------+
```

### Key Desktop Features

1. **GNOME / KDE Desktop Integration**:
   - Double-clicking `nodld-gui` or launching **Wnode Node Operator** from the Fedora Application Launcher starts the app.
   - Automatically registers `wnode-node-operator.desktop` in `~/.local/share/applications/`.
2. **System Tray / Taskbar Status Icon**:
   - 🟢 **Green (Active)**: Node is online, routing telemetry, and accepting compute workloads.
   - 🟡 **Yellow (Resting)**: Node is resting automatically because user PC activity (mouse/keyboard) was detected.
   - 🔴 **Red (Off)**: Node is turned off by user toggle.
3. **Smart Idle Detection (User Preference)**:
   - When enabled, the node monitors system input devices and pauses compute workloads during active user interaction, ensuring zero impact on your gaming, work, or browsing performance.
4. **Custom Work & Rest Schedules**:
   - Allows setting dedicated active hours (e.g. Work overnight 11 PM – 7 AM, Rest during office hours).

---

## 2. Interactive Headless Terminal Menu (`./nodld menu`)

For headless servers, remote SSH sessions, or CLI users, running `./nodld menu` (or `./nodld --menu`) opens an interactive text-based control panel:

```
=================================================================
             WNODE SOVEREIGN MESH - NODE OPERATOR               
=================================================================
 Status: READY | Mode: HEADLESS CLI INTERACTIVE
 Registration Token: REG-e17109e3-a2aa...
 Smart Idle Detection: ENABLED (Pauses when user is active)
 Work Schedule: ACTIVE (23:00 - 07:00)
-----------------------------------------------------------------
  [1] Start Node Daemon (Live Working Mode)
  [2] Set / Update Registration Claim Token
  [3] Configure Work & Rest Schedules
  [4] Toggle Smart Idle Detection (Pause on PC Activity)
  [5] View Real-Time Telemetry & Vitals
  [6] Install Systemd Background Service
  [7] Exit
=================================================================
 Select option [1-7]: 
```

### CLI Menu Commands & Capabilities

- **Option 1 (Start Daemon)**: Bootstraps the Go mesh engine, registers SECCOMP sandboxes, and enters live telemetry reporting mode.
- **Option 2 (Claim Token Pairing)**: Prompts for your Nodlr Portal / Command Centre registration token (`REG-xxx`) to link node telemetry with your account.
- **Option 3 (Schedule Configuration)**: Guided setup for active work and rest hours.
- **Option 4 (Smart Idle Toggle)**: Instantly toggles PC user activity sensing ON or OFF.
- **Option 5 (Telemetry Inspection)**: Displays live CPU/RAM footprint, H3 spatial hex code, WorkScore, and SECCOMP security status.
- **Option 6 (Automated Systemd Service Builder)**: Generates and installs systemd background service entries (`sudo systemctl enable --now nodld`).
