package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
)

type Logo struct {
	Name string  `json:"name"`
	SVG  *string `json:"svg"`
	PNG  *string `json:"png"`
}

func main() {
	statePath := os.Getenv("STATE_PATH")
	if statePath == "" {
		statePath = "state/engine.json"
	}

	forensicsStore := forensics.NewStore("SOVEREIGN_SECRET_2026", "NODL_SALT")
	store := account.NewStore(forensicsStore, statePath)
	if err := store.LoadState(); err != nil {
		fmt.Println("No existing state or error loading:", err)
		// Proceeding anyway as LoadState handles empty states
	}

	logosData, err := os.ReadFile("/home/obregan/Documents/nodl/integrations/logos/logos.json")
	var logos []Logo
	if err == nil {
		_ = json.Unmarshal(logosData, &logos)
	} else {
		fmt.Println("Warning: could not read logos.json:", err)
	}

	logoMap := make(map[string]string)
	for _, l := range logos {
		name := strings.ToLower(l.Name)
		if l.SVG != nil && *l.SVG != "" {
			logoMap[name] = *l.SVG
		} else if l.PNG != nil && *l.PNG != "" {
			logoMap[name] = *l.PNG
		}
	}

	baseDir := "/home/obregan/Documents/nodl/integrations"
	entries, err := os.ReadDir(baseDir)
	if err != nil {
		fmt.Println("Error reading integrations dir:", err)
		return
	}

	countImported := 0
	countUpdated := 0

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		if entry.Name() == "logos" || entry.Name() == "_logos" {
			continue
		}

		mdPath := filepath.Join(baseDir, entry.Name(), "integration.md")
		data, err := os.ReadFile(mdPath)
		if err != nil {
			continue // skip if no integration.md
		}

		content := string(data)
		lines := strings.Split(content, "\n")
		
		name := ""
		status := "active"
		desc := ""

		for i, line := range lines {
			if strings.HasPrefix(line, "# ") {
				name = strings.TrimSpace(strings.TrimPrefix(line, "# "))
				name = strings.TrimSuffix(name, " Integration")
			}
			if strings.HasPrefix(line, "## Status") && i+1 < len(lines) {
				statusLine := strings.ToLower(strings.TrimSpace(lines[i+1]))
				if strings.Contains(statusLine, "live") {
					status = "live"
				} else if strings.Contains(statusLine, "integrated") || strings.Contains(statusLine, "active") {
					status = "active"
				}
			}
			if strings.HasPrefix(line, "## Overview") && i+1 < len(lines) {
				desc = strings.TrimSpace(lines[i+1])
			}
		}

		if name == "" {
			name = entry.Name()
		}

		slug := entry.Name()
		logoURL := ""
		if url, ok := logoMap[strings.ToLower(name)]; ok {
			logoURL = url
		}

		// Insert or Update
		var existing *account.Integration
		for _, it := range store.ListIntegrationsSorted() {
			if it.Slug == slug {
				existing = it
				break
			}
		}

		if existing != nil {
			// Update
			_, _ = store.UpdateIntegration(existing.ID, map[string]interface{}{
				"name":     name,
				"status":   status,
				"logo_url": logoURL,
				"details":  map[string]any{"description": desc},
			})
			countUpdated++
		} else {
			// Create
			_ = store.CreateIntegration(&account.Integration{
				Name:    name,
				Slug:    slug,
				Status:  status,
				LogoURL: logoURL,
				Details: map[string]any{"description": desc},
			})
			countImported++
		}
	}

	// Give time for async SaveState to finish
	_ = store.SaveState() // Ensure sync save just in case

	fmt.Printf("Import completed. Inserted: %d, Updated: %d\n", countImported, countUpdated)
}
