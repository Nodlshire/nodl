package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/obregan/nodl/node-operator/src/auth"
	"github.com/obregan/nodl/node-operator/src/device"
	"github.com/obregan/nodl/node-operator/src/platform"
)

var pageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wnode Operator Control Panel</title>
    <style>
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #0b0f19; color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 680px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        h1 { color: #38bdf8; font-size: 22px; margin-top: 0; display: flex; align-items: center; justify-content: space-between; }
        .badge { font-size: 12px; padding: 4px 12px; border-radius: 9999px; background: #0369a1; color: #e0f2fe; font-weight: bold; }
        .badge.paused { background: #d97706; color: #fffbeb; }
        .badge.unpaired { background: #be123c; color: #ffe4e6; }
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
        label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 6px; font-weight: 600; }
        input[type="text"], select { width: 100%; padding: 10px 14px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 14px; margin-bottom: 12px; }
        button { background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        button:hover { background: #0369a1; }
        .days-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
        .day-check { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #cbd5e1; }
        .meta-row { display: flex; justify-content: space-between; font-size: 13px; color: #cbd5e1; padding: 6px 0; border-bottom: 1px solid #1e293b; }
        .meta-row:last-child { border-bottom: none; }
        .msg { padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; font-weight: 600; }
        .msg.success { background: #065f46; color: #a7f3d0; }
        .msg.error { background: #881337; color: #fecdd3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            <span>Wnode Node Operator</span>
            <span class="badge {{if not .DeviceToken}}unpaired{{else if .IsPaused}}paused{{end}}">
                {{if not .DeviceToken}}UNPAIRED{{else if .IsPaused}}PAUSED BY SCHEDULE{{else}}ONLINE & SYNCING{{end}}
            </span>
        </h1>

        {{if .Message}}
        <div class="msg {{.MessageType}}">{{.Message}}</div>
        {{end}}

        <div class="card">
            <h3 style="margin-top:0; font-size:15px; color:#e2e8f0;">Node Identity & Pairing</h3>
            <div class="meta-row"><span>UPID:</span> <strong>{{if .UPID}}{{.UPID}}{{else}}Pending Registration{{end}}</strong></div>
            <div class="meta-row"><span>Device Token:</span> <strong>{{if .DeviceToken}}{{.DeviceTokenMasked}}{{else}}None{{end}}</strong></div>
            <div class="meta-row"><span>Orchestrator API:</span> <strong>{{.MeshAPI}}</strong></div>

            {{if not .DeviceToken}}
            <form action="/pair" method="POST" style="margin-top:16px;">
                <label for="token">Pair with Nodlr Account Token:</label>
                <input type="text" id="token" name="token" placeholder="Paste WNODE-AUTH-... token here" required>
                <button type="submit">Pair Operator</button>
            </form>
            {{end}}
        </div>

        <div class="card">
            <h3 style="margin-top:0; font-size:15px; color:#e2e8f0;">Workload Scheduling Engine</h3>
            <form action="/schedule" method="POST">
                <label>
                    <input type="checkbox" name="enabled" value="true" {{if .Schedule.Enabled}}checked{{end}}>
                    Enable Compute Schedule Window
                </label>
                
                <div style="display:flex; gap:12px; margin-top:12px;">
                    <div style="flex:1;">
                        <label for="start_time">Start Active Window:</label>
                        <select id="start_time" name="start_time">
                            {{range .TimeOptions}}
                            <option value="{{.}}" {{if eq . $.Schedule.StartTime}}selected{{end}}>{{.}}</option>
                            {{end}}
                        </select>
                    </div>
                    <div style="flex:1;">
                        <label for="end_time">End Active Window:</label>
                        <select id="end_time" name="end_time">
                            {{range .TimeOptions}}
                            <option value="{{.}}" {{if eq . $.Schedule.EndTime}}selected{{end}}>{{.}}</option>
                            {{end}}
                        </select>
                    </div>
                </div>

                <label>Active Days of Week:</label>
                <div class="days-grid">
                    {{range .AllDays}}
                    <label class="day-check">
                        <input type="checkbox" name="days" value="{{.}}" {{if index $.SelectedDays .}}checked{{end}}>
                        {{.}}
                    </label>
                    {{end}}
                </div>

                <button type="submit">Save Schedule Settings</button>
            </form>
        </div>

        <div class="card">
            <h3 style="margin-top:0; font-size:15px; color:#e2e8f0;">System Autostart & Application Shortcuts</h3>
            <p style="font-size:13px; color:#94a3b8; margin-bottom:12px;">Keep Wnode Operator running automatically in the background on system boot with Application Menu and Desktop shortcuts.</p>
            <form action="/shortcuts" method="POST">
                <button type="submit" style="background:#059669;">Install Shortcuts & Enable Autostart on Boot</button>
            </form>
        </div>
    </div>
</body>
</html>`

type PageData struct {
	UPID               string
	DeviceToken        string
	DeviceTokenMasked  string
	MeshAPI            string
	IsPaused           bool
	Schedule           *platform.ScheduleConfig
	TimeOptions        []string
	AllDays            []string
	SelectedDays       map[string]bool
	Message            string
	MessageType        string
}

func main() {
	flagToken := flag.String("token", "", "Registration token from Nodlr")
	flagAPI := flag.String("api", "https://cmd.wnode.one", "Orchestrator API Base URL")
	flagPort := flag.String("port", "45975", "Control panel HTTP port")
	flagNoBrowser := flag.Bool("no-browser", false, "Do not auto-open browser on launch")
	flag.Parse()

	state, err := platform.LoadState()
	if err != nil || state == nil {
		state = &platform.State{Version: "1.0.0"}
	}

	apiBase := *flagAPI
	if envApi := os.Getenv("WNODE_API_BASE"); envApi != "" {
		apiBase = envApi
	}
	if state.MeshAPI == "" || strings.Contains(state.MeshAPI, "127.0.0.1:3001") || strings.Contains(state.MeshAPI, "localhost:3000") {
		state.MeshAPI = apiBase
	} else {
		apiBase = state.MeshAPI
	}

	// Ensure UPID is hydrated immediately
	if state.UPID == "" {
		bootMeta := device.CollectMetadata()
		state.UPID = device.ComputeHardwareHash(bootMeta)
		bootMetrics := device.CollectMetrics(state)
		state.CPUCores = bootMetrics.CPUCores
		state.MemoryGB = bootMetrics.MemoryGB
		_ = platform.SaveState(state)
	}

	// Auto-pair if token is provided or present in ~/.wnode/token
	_ = auth.PairDesktopToken(apiBase, *flagToken, state)

	if state.Schedule == nil {
		state.Schedule = &platform.ScheduleConfig{
			Enabled:   false,
			StartTime: "23:00",
			EndTime:   "07:00",
			Days:      []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"},
		}
	}

	// Start 30s Schedule Enforcer Loop
	device.StartScheduleEnforcer(state, func(isPaused bool) {
		log.Printf("[SCHEDULER] State transition: paused=%v", isPaused)
	})

	// Start Background Telemetry & Epoch Sync Loops if paired
	if state.DeviceToken != "" {
		log.Printf("[TELEMETRY] Starting epoch sync & heartbeat loop for UPID=%s", state.UPID)
		go device.StartEpochSyncLoop(apiBase, state)
		go device.StartHeartbeatLoop(apiBase, state)
	}

	tmpl := template.Must(template.New("page").Parse(pageHTML))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		data := buildPageData(state, apiBase, "", "")
		tmpl.Execute(w, data)
	})

	http.HandleFunc("/pair", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			tok := strings.TrimSpace(r.FormValue("token"))
			if tok != "" {
				if err := auth.AuthenticateHeadless(apiBase, tok, state); err != nil {
					data := buildPageData(state, apiBase, fmt.Sprintf("Pairing failed: %v", err), "error")
					tmpl.Execute(w, data)
					return
				}
				// Start telemetry on successful pairing
				go device.StartEpochSyncLoop(apiBase, state)
				go device.StartHeartbeatLoop(apiBase, state)
				data := buildPageData(state, apiBase, "Operator successfully paired to Nodlr account!", "success")
				tmpl.Execute(w, data)
				return
			}
		}
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})

	http.HandleFunc("/schedule", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			r.ParseForm()
			enabled := r.FormValue("enabled") == "true"
			startTime := r.FormValue("start_time")
			endTime := r.FormValue("end_time")
			days := r.Form["days"]

			state.Schedule.Enabled = enabled
			state.Schedule.StartTime = startTime
			state.Schedule.EndTime = endTime
			state.Schedule.Days = days

			if err := platform.SaveState(state); err != nil {
				data := buildPageData(state, apiBase, fmt.Sprintf("Failed to save schedule: %v", err), "error")
				tmpl.Execute(w, data)
				return
			}
			data := buildPageData(state, apiBase, "Schedule settings saved successfully!", "success")
			tmpl.Execute(w, data)
			return
		}
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})

	http.HandleFunc("/shortcuts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			if err := installDesktopShortcuts(); err != nil {
				data := buildPageData(state, apiBase, fmt.Sprintf("Failed to install autostart shortcuts: %v", err), "error")
				tmpl.Execute(w, data)
				return
			}
			data := buildPageData(state, apiBase, "Desktop & Application Menu shortcuts installed successfully! Autostart enabled.", "success")
			tmpl.Execute(w, data)
			return
		}
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})

	// Automatically ensure system autostart and desktop shortcuts on launch
	go func() {
		_ = installDesktopShortcuts()
	}()

	url := fmt.Sprintf("http://127.0.0.1:%s", *flagPort)
	log.Printf("Wnode Desktop Control Panel running on %s", url)

	if !*flagNoBrowser {
		go openBrowser(url)
	}

	if err := http.ListenAndServe(":"+*flagPort, nil); err != nil {
		log.Fatalf("Control panel server error: %v", err)
	}
}

func buildPageData(state *platform.State, apiBase, msg, msgType string) PageData {
	daysMap := make(map[string]bool)
	if state.Schedule != nil {
		for _, d := range state.Schedule.Days {
			daysMap[d] = true
		}
	}
	return PageData{
		UPID:              state.UPID,
		DeviceToken:       state.DeviceToken,
		DeviceTokenMasked: maskToken(state.DeviceToken),
		MeshAPI:           apiBase,
		IsPaused:          device.IsPausedBySchedule(),
		Schedule:          state.Schedule,
		TimeOptions:       generateTimeOptions(),
		AllDays:           []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"},
		SelectedDays:      daysMap,
		Message:           msg,
		MessageType:       msgType,
	}
}

func maskToken(tok string) string {
	if len(tok) < 12 {
		return "Unpaired"
	}
	return fmt.Sprintf("%s...%s", tok[:6], tok[len(tok)-4:])
}

func generateTimeOptions() []string {
	var opts []string
	for h := 0; h < 24; h++ {
		for m := 0; m < 60; m += 30 {
			opts = append(opts, fmt.Sprintf("%02d:%02d", h, m))
		}
	}
	return opts
}

func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		if _, errLook := exec.LookPath("google-chrome"); errLook == nil {
			err = exec.Command("google-chrome", "--app="+url, "--user-data-dir="+filepath.Join(os.TempDir(), "wnode-app-profile")).Start()
		} else if _, errLook := exec.LookPath("chromium-browser"); errLook == nil {
			err = exec.Command("chromium-browser", "--app="+url, "--user-data-dir="+filepath.Join(os.TempDir(), "wnode-app-profile")).Start()
		} else if _, errLook := exec.LookPath("chromium"); errLook == nil {
			err = exec.Command("chromium", "--app="+url, "--user-data-dir="+filepath.Join(os.TempDir(), "wnode-app-profile")).Start()
		} else if _, errLook := exec.LookPath("brave-browser"); errLook == nil {
			err = exec.Command("brave-browser", "--app="+url, "--user-data-dir="+filepath.Join(os.TempDir(), "wnode-app-profile")).Start()
		} else {
			err = exec.Command("xdg-open", url).Start()
		}
	case "windows":
		if _, errLook := exec.LookPath("msedge"); errLook == nil {
			err = exec.Command("msedge", "--app="+url).Start()
		} else {
			err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
		}
	case "darwin":
		err = exec.Command("open", "-a", "Google Chrome", "--args", "--app="+url).Start()
		if err != nil {
			err = exec.Command("open", url).Start()
		}
	}
	if err != nil {
		log.Printf("Could not auto-open desktop window: %v", err)
	}
}

func installDesktopShortcuts() error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	if runtime.GOOS == "linux" {
		desktopContent := fmt.Sprintf(`[Desktop Entry]
Name=Wnode Control Panel
Comment=Sovereign Mesh Node Operator & Control Panel
Exec=%s
Icon=utilities-terminal
Terminal=false
Type=Application
Categories=Utility;Network;System;
StartupNotify=true
`, exePath)

		// 1. Application Menu Entry
		appDir := filepath.Join(home, ".local", "share", "applications")
		_ = os.MkdirAll(appDir, 0755)
		_ = os.WriteFile(filepath.Join(appDir, "wnode-operator.desktop"), []byte(desktopContent), 0755)

		// 2. Desktop Shortcut
		desktopDir := filepath.Join(home, "Desktop")
		if _, err := os.Stat(desktopDir); err == nil {
			_ = os.WriteFile(filepath.Join(desktopDir, "Wnode-Operator.desktop"), []byte(desktopContent), 0755)
		}

		// 3. Autostart Launcher
		autostartDir := filepath.Join(home, ".config", "autostart")
		_ = os.MkdirAll(autostartDir, 0755)
		autostartContent := fmt.Sprintf(`[Desktop Entry]
Name=Wnode Control Panel
Comment=Sovereign Mesh Node Operator Autostart
Exec=%s --no-browser
Terminal=false
Type=Application
X-GNOME-Autostart-enabled=true
`, exePath)
		_ = os.WriteFile(filepath.Join(autostartDir, "wnode-operator.desktop"), []byte(autostartContent), 0755)

		// 4. Systemd User Service
		systemdDir := filepath.Join(home, ".config", "systemd", "user")
		_ = os.MkdirAll(systemdDir, 0755)
		svcContent := fmt.Sprintf(`[Unit]
Description=Wnode Operator Control Panel Daemon
After=network.target

[Service]
ExecStart=%s --no-browser
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
`, exePath)
		_ = os.WriteFile(filepath.Join(systemdDir, "wnode-operator.service"), []byte(svcContent), 0644)
		_ = exec.Command("systemctl", "--user", "daemon-reload").Run()
		_ = exec.Command("systemctl", "--user", "enable", "wnode-operator").Run()
	} else if runtime.GOOS == "darwin" {
		launchAgents := filepath.Join(home, "Library", "LaunchAgents")
		_ = os.MkdirAll(launchAgents, 0755)
		plist := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>one.wnode.operator</string>
    <key>ProgramArguments</key>
    <array>
        <string>%s</string>
        <string>--no-browser</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>`, exePath)
		_ = os.WriteFile(filepath.Join(launchAgents, "one.wnode.operator.plist"), []byte(plist), 0644)
	} else if runtime.GOOS == "windows" {
		cmd := exec.Command("reg", "add", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", "/v", "WnodeOperator", "/t", "REG_SZ", "/d", fmt.Sprintf("\"%s\" --no-browser", exePath), "/f")
		_ = cmd.Run()
	}
	return nil
}
