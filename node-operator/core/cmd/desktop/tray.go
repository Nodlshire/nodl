package main

import (
	"fmt"
	"log"
	"os/exec"
	"runtime"
	"sync"
)

// TrayManager manages the system tray status icon and menu interactions.
type TrayManager struct {
	mu           sync.Mutex
	statusText   string
	isPaused     bool
	isPaired     bool
	controlURL   string
	onPauseToggle func(paused bool)
}

var globalTray *TrayManager

func initTray(controlURL string, isPaired bool, isPaused bool, onPauseToggle func(paused bool)) *TrayManager {
	tm := &TrayManager{
		statusText:    "Wnode Mesh: Initializing...",
		isPaired:      isPaired,
		isPaused:      isPaused,
		controlURL:    controlURL,
		onPauseToggle: onPauseToggle,
	}
	globalTray = tm
	tm.updateStatus()
	return tm
}

func (tm *TrayManager) updateStatus() {
	tm.mu.Lock()
	defer tm.mu.Unlock()

	if !tm.isPaired {
		tm.statusText = "Wnode Mesh: Unpaired (Action Required)"
	} else if tm.isPaused {
		tm.statusText = "Wnode Mesh: Paused by Schedule"
	} else {
		tm.statusText = "Wnode Mesh: Online & Transmitting"
	}
}

func (tm *TrayManager) SetState(isPaired bool, isPaused bool) {
	tm.mu.Lock()
	tm.isPaired = isPaired
	tm.isPaused = isPaused
	tm.mu.Unlock()
	tm.updateStatus()
}

// launchNativeAppWindow opens the control panel as a standalone desktop window (not a Chrome browser tab).
func launchNativeAppWindow(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		// Launch standalone Webview or Chromed App window with explicit WM_CLASS so it renders as a standalone desktop app
		if _, errLook := exec.LookPath("google-chrome"); errLook == nil {
			err = exec.Command("google-chrome",
				"--app="+url,
				"--class=wnode-operator",
				"--name=wnode-operator",
				"--user-data-dir=/tmp/wnode-desktop-profile",
				"--no-first-run",
				"--no-default-browser-check",
			).Start()
		} else if _, errLook := exec.LookPath("chromium-browser"); errLook == nil {
			err = exec.Command("chromium-browser",
				"--app="+url,
				"--class=wnode-operator",
				"--name=wnode-operator",
				"--user-data-dir=/tmp/wnode-desktop-profile",
				"--no-first-run",
			).Start()
		} else if _, errLook := exec.LookPath("chromium"); errLook == nil {
			err = exec.Command("chromium",
				"--app="+url,
				"--class=wnode-operator",
				"--name=wnode-operator",
				"--user-data-dir=/tmp/wnode-desktop-profile",
			).Start()
		} else if _, errLook := exec.LookPath("brave-browser"); errLook == nil {
			err = exec.Command("brave-browser",
				"--app="+url,
				"--class=wnode-operator",
				"--name=wnode-operator",
				"--user-data-dir=/tmp/wnode-desktop-profile",
			).Start()
		} else {
			err = exec.Command("xdg-open", url).Start()
		}

	case "windows":
		if _, errLook := exec.LookPath("msedge"); errLook == nil {
			err = exec.Command("msedge",
				"--app="+url,
				"--user-data-dir=%TEMP%\\wnode-desktop-profile",
			).Start()
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
		log.Printf("[TRAY] Standalone window launch error: %v", err)
	} else {
		log.Printf("[TRAY] Standalone app window opened for: %s", url)
	}
}

// LogTrayStatus outputs current background tray status to daemon log
func (tm *TrayManager) LogStatus() {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	fmt.Printf("[TRAY ACTIVE] %s | Control Panel: %s\n", tm.statusText, tm.controlURL)
}
