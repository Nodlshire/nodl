package main

import (
	"fmt"
	"os/exec"
	"runtime"
	"time"
)

// DesktopGUIApp represents the out-of-the-box desktop application state.
type DesktopGUIApp struct {
	IsOnline            bool
	PauseOnUserActivity bool
	WorkScheduleActive  bool
	WorkStartHour       int
	WorkEndHour         int
	CurrentStatus       string // "ACTIVE", "RESTING", "OFF"
	CpuUsage            float64
	RamUsage            float64
	ActiveH3Hex         string
	TotalEarningsUSD    float64
}

func main() {
	app := &DesktopGUIApp{
		IsOnline:            true,
		PauseOnUserActivity: true,
		WorkScheduleActive:  false,
		WorkStartHour:       23,
		WorkEndHour:         7,
		CurrentStatus:       "ACTIVE",
		CpuUsage:            14.2,
		RamUsage:            42.8,
		ActiveH3Hex:         "88194ad2a3fffff",
		TotalEarningsUSD:    128.50,
	}

	fmt.Println("=================================================================")
	fmt.Println("         WNODE NODE OPERATOR - DESKTOP CONTROL APP               ")
	fmt.Println("=================================================================")
	fmt.Println(" Out-of-the-box GUI Launcher active on Fedora/Linux Desktop.")
	fmt.Println(" System Tray Icon: 🟢 GREEN (Active & Online)")
	fmt.Println("-----------------------------------------------------------------")
	fmt.Println(" App Window State:")
	fmt.Printf("   - Power Toggle:        [%s]\n", formatToggle(app.IsOnline))
	fmt.Printf("   - Smart Idle Pause:    [%s]\n", formatToggle(app.PauseOnUserActivity))
	fmt.Printf("   - Active Status:       🟢 %s\n", app.CurrentStatus)
	fmt.Printf("   - Hardware Vitals:     CPU: %.1f%% | RAM: %.1f%%\n", app.CpuUsage, app.RamUsage)
	fmt.Printf("   - Spatial Location:    H3 Hex: %s\n", app.ActiveH3Hex)
	fmt.Printf("   - Total Earnings:      $%.2f USD\n", app.TotalEarningsUSD)
	fmt.Println("=================================================================")

	// Automatically open the graphical web dashboard on port 3003 (Nodlr Operator Portal)
	go func() {
		time.Sleep(1500 * time.Millisecond)
		openBrowser("http://localhost:3003/dashboard/hardware")
	}()

	// Keep system tray process alive
	select {}
}

func formatToggle(active bool) string {
	if active {
		return "ON"
	}
	return "OFF"
}

func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	}
	if err != nil {
		fmt.Printf("Failed to open desktop browser: %v\n", err)
	}
}
