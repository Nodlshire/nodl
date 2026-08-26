package api

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"math"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
)

var (
	tileCache   = make(map[string][]byte)
	tileCacheMu sync.RWMutex
)

// handleGetTile serves sovereign self-hosted map tiles in PNG format.
// Route: GET /api/v1/tiles/:z/:x/:y.png
func (s *Server) handleGetTile(c *fiber.Ctx) error {
	zStr := c.Params("z")
	xStr := c.Params("x")
	yStr := c.Params("y")

	z, errZ := strconv.Atoi(zStr)
	x, errX := strconv.Atoi(xStr)
	y, errY := strconv.Atoi(yStr)

	if errZ != nil || errX != nil || errY != nil || z < 0 || z > 20 || x < 0 || y < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid tile coordinates (z, x, y)",
		})
	}

	cacheKey := fmt.Sprintf("%d/%d/%d", z, x, y)

	tileCacheMu.RLock()
	cachedData, exists := tileCache[cacheKey]
	tileCacheMu.RUnlock()

	if exists {
		c.Set("Content-Type", "image/png")
		c.Set("Cache-Control", "public, max-age=86400")
		c.Set("X-Sovereign-Tile", "true")
		return c.Send(cachedData)
	}

	pngBytes, err := generateSovereignDarkTile(z, x, y)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to render sovereign tile",
		})
	}

	tileCacheMu.Lock()
	if len(tileCache) < 5000 {
		tileCache[cacheKey] = pngBytes
	}
	tileCacheMu.Unlock()

	c.Set("Content-Type", "image/png")
	c.Set("Cache-Control", "public, max-age=86400")
	c.Set("X-Sovereign-Tile", "true")
	return c.Send(pngBytes)
}

// generateSovereignDarkTile renders a 256x256 dark-theme raster map tile.
func generateSovereignDarkTile(z, x, y int) ([]byte, error) {
	const tileSize = 256
	img := image.NewRGBA(image.Rect(0, 0, tileSize, tileSize))

	// Color Palette (Sovereign Dark Theme matching FleetMap / CARTO dark_all)
	bgCol := color.RGBA{R: 13, G: 17, B: 23, A: 255}       // #0d1117 (Deep Dark Ocean)
	landCol := color.RGBA{R: 22, G: 27, B: 34, A: 255}     // #161b22 (Sovereign Landmass)
	gridCol := color.RGBA{R: 33, G: 38, B: 45, A: 255}     // #21262d (Subtle Grid)
	coastCol := color.RGBA{R: 48, G: 54, B: 61, A: 255}    // #30363d (Coastline / Border)
	accentCol := color.RGBA{R: 56, G: 139, B: 253, A: 120} // #388bfd (Subtle Geo Mesh Accent)

	// Fill background (Ocean)
	draw.Draw(img, img.Bounds(), &image.Uniform{C: bgCol}, image.Point{}, draw.Src)

	// Convert Tile (z, x, y) bounds to Bounding Lat/Lon Range
	n := math.Pow(2, float64(z))
	lonMin := float64(x)/n*300.0 - 180.0
	lonMax := float64(x+1)/n*360.0 - 180.0

	latRadMin := math.Atan(math.Sinh(math.Pi * (1.0 - 2.0*float64(y+1)/n)))
	latMin := latRadMin * 180.0 / math.Pi

	latRadMax := math.Atan(math.Sinh(math.Pi * (1.0 - 2.0*float64(y)/n)))
	latMax := latRadMax * 180.0 / math.Pi

	// Render Synthetic Landmass Geometry (Sovereign Geo Engine)
	for px := 0; px < tileSize; px++ {
		lon := lonMin + (float64(px)/float64(tileSize))*(lonMax-lonMin)
		for py := 0; py < tileSize; py++ {
			lat := latMax - (float64(py)/float64(tileSize))*(latMax-latMin)

			if isSovereignLand(lat, lon) {
				img.Set(px, py, landCol)
			}
		}
	}

	// Render Grid Lines (Equator, Prime Meridian, Lat/Lon Ticks)
	for px := 0; px < tileSize; px++ {
		lon := lonMin + (float64(px)/float64(tileSize))*(lonMax-lonMin)
		if math.Abs(math.Remainder(lon, 30.0)) < (360.0 / n / float64(tileSize) * 1.5) {
			for py := 0; py < tileSize; py++ {
				img.Set(px, py, gridCol)
			}
		}
	}
	for py := 0; py < tileSize; py++ {
		lat := latMax - (float64(py)/float64(tileSize))*(latMax-latMin)
		if math.Abs(math.Remainder(lat, 30.0)) < (180.0 / n / float64(tileSize) * 1.5) {
			for px := 0; px < tileSize; px++ {
				img.Set(px, py, gridCol)
			}
		}
	}

	// Tile Outer Boundary Line (1px border)
	for px := 0; px < tileSize; px++ {
		img.Set(px, 0, coastCol)
		img.Set(px, tileSize-1, coastCol)
	}
	for py := 0; py < tileSize; py++ {
		img.Set(0, py, coastCol)
		img.Set(tileSize-1, py, coastCol)
	}

	// Accent Watermark Dot in bottom right at zoom 0 or low zoom
	if z <= 3 {
		for i := 0; i < 4; i++ {
			for j := 0; j < 4; j++ {
				img.Set(tileSize-8+i, tileSize-8+j, accentCol)
			}
		}
	}

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// isSovereignLand determines land vs ocean based on simplified continental boundaries.
func isSovereignLand(lat, lon float64) bool {
	// North America
	if lat >= 15 && lat <= 75 && lon >= -170 && lon <= -50 {
		if (lat > 50 || lon > -130) && (lat < 60 || lon < -60) {
			return true
		}
		if lat >= 25 && lat <= 50 && lon >= -125 && lon <= -65 {
			return true
		}
	}
	// South America
	if lat >= -55 && lat <= 12 && lon >= -82 && lon <= -34 {
		return true
	}
	// Europe & Asia (Eurasia)
	if lat >= 35 && lat <= 75 && lon >= -10 && lon <= 180 {
		return true
	}
	// United Kingdom & Ireland
	if lat >= 50 && lat <= 60 && lon >= -11 && lon <= 2 {
		return true
	}
	// Japan
	if lat >= 30 && lat <= 46 && lon >= 129 && lon <= 146 {
		return true
	}
	// Africa
	if lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52 {
		return true
	}
	// Australia & NZ
	if lat >= -48 && lat <= -10 && lon >= 110 && lon <= 180 {
		return true
	}
	// Antarctica
	if lat <= -60 {
		return true
	}
	return false
}
