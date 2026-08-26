package api

import (
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func TestSovereignTileEngine(t *testing.T) {
	app := fiber.New()
	s := &Server{app: app}

	app.Get("/api/v1/tiles/:z/:x/:y.png", s.handleGetTile)

	// Test 1: Valid Tile Request (z=0, x=0, y=0)
	req := httptest.NewRequest("GET", "/api/v1/tiles/0/0/0.png", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to execute tile request: %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType != "image/png" {
		t.Errorf("Expected Content-Type image/png, got %s", contentType)
	}

	isSovereign := resp.Header.Get("X-Sovereign-Tile")
	if isSovereign != "true" {
		t.Errorf("Expected X-Sovereign-Tile header true, got %s", isSovereign)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read tile body: %v", err)
	}

	if len(body) == 0 {
		t.Errorf("Tile body is empty")
	}

	// Verify PNG magic header bytes: 0x89 50 4E 47
	if len(body) < 4 || body[0] != 0x89 || body[1] != 'P' || body[2] != 'N' || body[3] != 'G' {
		t.Errorf("Invalid PNG header in generated tile")
	}

	// Test 2: Cached Tile Request
	reqCached := httptest.NewRequest("GET", "/api/v1/tiles/0/0/0.png", nil)
	respCached, err := app.Test(reqCached)
	if err != nil {
		t.Fatalf("Failed to execute cached tile request: %v", err)
	}

	if respCached.StatusCode != 200 {
		t.Errorf("Expected status 200 for cached tile, got %d", respCached.StatusCode)
	}

	// Test 3: Invalid Tile Coordinates
	reqInvalid := httptest.NewRequest("GET", "/api/v1/tiles/invalid/x/y.png", nil)
	respInvalid, err := app.Test(reqInvalid)
	if err != nil {
		t.Fatalf("Failed to execute invalid tile request: %v", err)
	}

	if respInvalid.StatusCode != 400 {
		t.Errorf("Expected status 400 for invalid coordinates, got %d", respInvalid.StatusCode)
	}
}
