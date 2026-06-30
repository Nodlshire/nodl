package main

import (
	"log"
	"os"

	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"

	"github.com/obregan/nodl/node-operator/src/platform"
	"github.com/obregan/nodl/node-operator/src/device"
)

func main() {
	a := app.New()
	w := a.NewWindow("Wnode Operator Desktop")

	statusLabel := widget.NewLabel("Status: Offline")
	
	startButton := widget.NewButton("Start Node", func() {
		statusLabel.SetText("Status: Connecting to Mesh...")
		go startNodlCore()
	})

	stopButton := widget.NewButton("Stop Node", func() {
		statusLabel.SetText("Status: Offline")
		// Logic to signal shutdown
	})

	w.SetContent(container.NewVBox(
		statusLabel,
		startButton,
		stopButton,
	))

	w.ShowAndRun()
}

func startNodlCore() {
	platform.Info("Desktop GUI starting nodl-core background wrapper")
	
	state := &platform.State{
		DeviceToken: os.Getenv("NODL_DEVICE_TOKEN"),
	}

	if state.DeviceToken == "" {
		log.Println("Warning: NODL_DEVICE_TOKEN not set, joining mesh might fail.")
	}

	apiBase := "http://localhost:3000"
	go device.StartEpochSyncLoop(apiBase, state)

	// Keep core running...
}
