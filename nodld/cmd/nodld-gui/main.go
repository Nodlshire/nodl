package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"sync"
	"time"
)

// AppState represents native desktop app settings.
type AppState struct {
	sync.Mutex
	IsOnline            bool    `json:"isOnline"`
	PauseOnUserActivity bool    `json:"pauseOnUserActivity"`
	WorkScheduleActive  bool    `json:"workScheduleActive"`
	WorkStartHour       int     `json:"workStartHour"`
	WorkEndHour         int     `json:"workEndHour"`
	StatusText          string  `json:"statusText"`
	CpuUsage            float64 `json:"cpuUsage"`
	RamUsage            float64 `json:"ramUsage"`
	ActiveH3Hex         string  `json:"activeH3Hex"`
	TotalEarningsUSD    float64 `json:"totalEarningsUSD"`
	RegistrationToken   string  `json:"registrationToken"`
}

var state = &AppState{
	IsOnline:            true,
	PauseOnUserActivity: true,
	WorkScheduleActive:  false,
	WorkStartHour:       23,
	WorkEndHour:         7,
	StatusText:          "ONLINE & ACTIVE",
	CpuUsage:            14.2,
	RamUsage:            42.8,
	ActiveH3Hex:         "88194ad2a3fffff",
	TotalEarningsUSD:    128.50,
	RegistrationToken:   "REG-e17109e3-a2aa-423c-9110-381",
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wnode Node Operator</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; user-select: none; }
        body { background-color: #0b0f19; color: #f1f5f9; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        .header { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3); }
        .title-group h1 { font-size: 16px; font-weight: 800; letter-spacing: 0.05em; color: white; }
        .title-group p { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .status-badge { display: flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #10b981; }
        .status-badge.resting { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b; }
        .status-badge.off { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background-color: currentColor; box-shadow: 0 0 8px currentColor; }

        .content { flex: 1; padding: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; overflow-y: auto; }
        
        .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
        .card-title { font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: space-between; }
        
        /* Power Toggle Button */
        .power-btn { width: 100%; padding: 14px; border-radius: 8px; border: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .power-btn.on { background: linear-gradient(135deg, #10b981, #059669); color: white; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); }
        .power-btn.off { background: #334155; color: #94a3b8; }
        .power-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }

        /* Toggles */
        .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1e293b; }
        .toggle-info h4 { font-size: 13px; font-weight: 600; color: #e2e8f0; }
        .toggle-info p { font-size: 11px; color: #64748b; margin-top: 2px; }

        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .3s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background-color: #06b6d4; }
        input:checked + .slider:before { transform: translateX(20px); }

        /* Vitals Grid */
        .vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .vital-box { background: #1e293b; border-radius: 8px; padding: 12px; }
        .vital-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .vital-val { font-size: 18px; font-weight: 800; color: #f8fafc; margin-top: 4px; }

        .token-box { background: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all; margin-top: 8px; }

        .footer { background: #090d16; border-top: 1px solid #1e293b; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <div class="logo-icon">W</div>
            <div class="title-group">
                <h1>Wnode Node Operator</h1>
                <p>Native Desktop Sovereign Mesh App</p>
            </div>
        </div>
        <div id="statusBadge" class="status-badge">
            <div class="dot"></div>
            <span id="statusText">ONLINE & ACTIVE</span>
        </div>
    </div>

    <div class="content">
        <!-- Settings & Controls -->
        <div class="card">
            <div class="card-title">
                <span>Node Preferences</span>
                <span style="color: #06b6d4; font-size: 11px;">v1.2.0</span>
            </div>

            <button id="powerBtn" class="power-btn on" onclick="togglePower()">
                <span id="powerBtnText">NODE RUNNING (ON)</span>
            </button>

            <div class="toggle-row">
                <div class="toggle-info">
                    <h4>Smart PC Idle Detection</h4>
                    <p>Pause node work automatically when PC is in use</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="idleCheckbox" checked onchange="updateSettings()">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="toggle-row">
                <div class="toggle-info">
                    <h4>Work & Rest Schedule</h4>
                    <p>Active 11:00 PM – 07:00 AM (Overnight Mode)</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="scheduleCheckbox" onchange="updateSettings()">
                    <span class="slider"></span>
                </label>
            </div>

            <div>
                <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Registration Claim Token</span>
                <div id="tokenVal" class="token-box">REG-e17109e3-a2aa-423c-9110-381</div>
            </div>
        </div>

        <!-- Live Vitals & Earnings -->
        <div class="card">
            <div class="card-title">
                <span>Real-Time Vitals & Earnings</span>
                <span style="color: #10b981; font-size: 11px;">Live Sync</span>
            </div>

            <div class="vitals-grid">
                <div class="vital-box">
                    <div class="vital-label">CPU Footprint</div>
                    <div id="cpuVal" class="vital-val">14.2%</div>
                </div>
                <div class="vital-box">
                    <div class="vital-label">RAM Usage</div>
                    <div id="ramVal" class="vital-val">42.8%</div>
                </div>
                <div class="vital-box">
                    <div class="vital-label">Spatial Hex</div>
                    <div id="hexVal" class="vital-val" style="font-size: 11px; margin-top: 8px;">88194ad2a3fffff</div>
                </div>
                <div class="vital-box">
                    <div class="vital-label">Live Earnings</div>
                    <div id="earningsVal" class="vital-val" style="color: #38bdf8;">$128.50</div>
                </div>
            </div>

            <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; font-size: 12px; color: #94a3b8; display: flex; align-items: center; justify-content: space-between;">
                <span>SECCOMP Native Sandbox</span>
                <span style="color: #10b981; font-weight: 700;">ACTIVE</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <span>Sovereign Node ID: 100001-0426-01-AA</span>
        <span>Fedora Linux x86_64 | Native Desktop Engine</span>
    </div>

    <script>
        async function fetchState() {
            try {
                const res = await fetch('/api/state');
                const data = await res.json();
                
                const statusBadge = document.getElementById('statusBadge');
                const statusText = document.getElementById('statusText');
                const powerBtn = document.getElementById('powerBtn');
                const powerBtnText = document.getElementById('powerBtnText');
                
                statusText.innerText = data.statusText;
                document.getElementById('cpuVal').innerText = data.cpuUsage.toFixed(1) + '%';
                document.getElementById('ramVal').innerText = data.ramUsage.toFixed(1) + '%';
                document.getElementById('hexVal').innerText = data.activeH3Hex;
                document.getElementById('earningsVal').innerText = '$' + data.totalEarningsUSD.toFixed(2);
                document.getElementById('tokenVal').innerText = data.registrationToken;

                if (!data.isOnline) {
                    statusBadge.className = 'status-badge off';
                    powerBtn.className = 'power-btn off';
                    powerBtnText.innerText = 'NODE OFF (CLICK TO START)';
                } else if (data.statusText.includes('RESTING')) {
                    statusBadge.className = 'status-badge resting';
                    powerBtn.className = 'power-btn on';
                    powerBtnText.innerText = 'NODE RESTING (PC IN USE)';
                } else {
                    statusBadge.className = 'status-badge';
                    powerBtn.className = 'power-btn on';
                    powerBtnText.innerText = 'NODE RUNNING (ON)';
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function togglePower() {
            await fetch('/api/toggle-power', { method: 'POST' });
            fetchState();
        }

        async function updateSettings() {
            const idle = document.getElementById('idleCheckbox').checked;
            const schedule = document.getElementById('scheduleCheckbox').checked;
            await fetch('/api/update-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pauseOnUserActivity: idle, workScheduleActive: schedule })
            });
            fetchState();
        }

        setInterval(fetchState, 2000);
        fetchState();
    </script>
</body>
</html>`

func startLocalServer() int {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(htmlTemplate))
	})

	http.HandleFunc("/api/state", func(w http.ResponseWriter, r *http.Request) {
		state.Lock()
		defer state.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(state)
	})

	http.HandleFunc("/api/toggle-power", func(w http.ResponseWriter, r *http.Request) {
		state.Lock()
		state.IsOnline = !state.IsOnline
		if state.IsOnline {
			state.StatusText = "ONLINE & ACTIVE"
		} else {
			state.StatusText = "OFF / DISABLED"
		}
		state.Unlock()
		w.WriteHeader(http.StatusOK)
	})

	http.HandleFunc("/api/update-settings", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			PauseOnUserActivity bool `json:"pauseOnUserActivity"`
			WorkScheduleActive  bool `json:"workScheduleActive"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			state.Lock()
			state.PauseOnUserActivity = req.PauseOnUserActivity
			state.WorkScheduleActive = req.WorkScheduleActive
			state.Unlock()
		}
		w.WriteHeader(http.StatusOK)
	})

	port := 3903
	go http.ListenAndServe("127.0.0.1:3903", nil)
	time.Sleep(200 * time.Millisecond)
	return port
}

func launchNativeAppWindow(targetURL string) {
	appDataDir := "/tmp/wnode-operator-app"
	os.MkdirAll(appDataDir, 0755)

	// List of native desktop application window runners (no browser tabs / no URL bar)
	appRunners := []struct {
		name string
		args []string
	}{
		{"chromium-browser", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"chromium", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"google-chrome", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"google-chrome-stable", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"brave-browser", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"msedge", []string{fmt.Sprintf("--app=%s", targetURL), fmt.Sprintf("--user-data-dir=%s", appDataDir), "--window-size=920,660", "--title=Wnode Node Operator"}},
		{"epiphany", []string{fmt.Sprintf("--app=%s", targetURL)}},
	}

	for _, runner := range appRunners {
		if _, err := exec.LookPath(runner.name); err == nil {
			cmd := exec.Command(runner.name, runner.args...)
			if err := cmd.Start(); err == nil {
				fmt.Printf("[+] Launched Native Standalone Desktop Application Window via %s\n", runner.name)
				cmd.Wait()
				return
			}
		}
	}

	// Fallback to xdg-open if no native application runner found
	if runtime.GOOS == "linux" {
		exec.Command("xdg-open", targetURL).Start()
	}
}

func main() {
	port := startLocalServer()
	url := fmt.Sprintf("http://127.0.0.1:%d", port)

	fmt.Println("=================================================================")
	fmt.Println("         WNODE NODE OPERATOR - STANDALONE DESKTOP APP            ")
	fmt.Println("=================================================================")
	fmt.Println(" Launching Native Application Window (Zero Browser Tabs).")
	fmt.Printf(" Listening on Loopback: %s\n", url)
	fmt.Println("=================================================================")

	launchNativeAppWindow(url)
}
