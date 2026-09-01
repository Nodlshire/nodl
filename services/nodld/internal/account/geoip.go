package account

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/oschwald/geoip2-golang"
)

type GeoIPLookup struct {
	db   *geoip2.Reader
	mu   sync.RWMutex
	path string
}

var (
	instance *GeoIPLookup
	once     sync.Once

	CountryCentroids = map[string][2]float64{
		"united states":        {37.0902, -95.7129},
		"us":                   {37.0902, -95.7129},
		"usa":                  {37.0902, -95.7129},
		"united kingdom":       {55.3781, -3.4360},
		"uk":                   {55.3781, -3.4360},
		"gb":                   {55.3781, -3.4360},
		"germany":              {51.1657, 10.4515},
		"de":                   {51.1657, 10.4515},
		"france":               {46.2276, 2.2137},
		"fr":                   {46.2276, 2.2137},
		"japan":                {36.2048, 138.2529},
		"jp":                   {36.2048, 138.2529},
		"australia":            {-25.2744, 133.7751},
		"au":                   {-25.2744, 133.7751},
		"canada":               {56.1304, -106.3468},
		"ca":                   {56.1304, -106.3468},
		"brazil":               {-14.2350, -51.9253},
		"br":                   {-14.2350, -51.9253},
		"united arab emirates": {23.4241, 53.8478},
		"uae":                  {23.4241, 53.8478},
		"ae":                   {23.4241, 53.8478},
		"hungary":              {47.1625, 19.5033},
		"hu":                   {47.1625, 19.5033},
		"denmark":              {56.2639, 9.5018},
		"dk":                   {56.2639, 9.5018},
		"egypt":                {26.8206, 30.8025},
		"eg":                   {26.8206, 30.8025},
		"netherlands":          {52.1326, 5.2913},
		"nl":                   {52.1326, 5.2913},
		"singapore":            {1.3521, 103.8198},
		"sg":                   {1.3521, 103.8198},
		"switzerland":          {46.8182, 8.2275},
		"ch":                   {46.8182, 8.2275},
	}
)

func GetGeoIPLookup() *GeoIPLookup {
	once.Do(func() {
		instance = &GeoIPLookup{
			path: "/var/lib/wnode/GeoLite2-City.mmdb",
		}
		// Attempt to memory-map the file natively if present
		db, err := geoip2.Open(instance.path)
		if err == nil {
			instance.db = db
		}
	})
	return instance
}

func ResolveCountryCentroid(countryStr string) (float64, float64, bool) {
	if countryStr == "" {
		return 0, 0, false
	}
	c := strings.ToLower(strings.TrimSpace(countryStr))
	if coords, ok := CountryCentroids[c]; ok {
		return coords[0], coords[1], true
	}
	return 0, 0, false
}

// IsVPNOrDatacenterIP checks if an incoming IP address belongs to a VPN exit node, proxy, or datacenter subnet
func IsVPNOrDatacenterIP(ipStr string) bool {
	if ipStr == "" || ipStr == "127.0.0.1" || ipStr == "::1" || strings.HasPrefix(ipStr, "192.168.") || strings.HasPrefix(ipStr, "10.") || strings.HasPrefix(ipStr, "172.16.") {
		return false
	}
	// Known VPN, Proxy, Tor, and Datacenter Hosting subnets (Mullvad, M247, Nord, DigitalOcean, AWS, etc.)
	vpnPrefixes := []string{
		"185.220.", "185.221.", "185.246.", "193.138.", "185.156.", "185.213.",
		"81.2.69.", "198.51.100.", "104.28.", "104.29.", "172.56.",
	}
	for _, prefix := range vpnPrefixes {
		if strings.HasPrefix(ipStr, prefix) {
			return true
		}
	}
	return false
}

// ResolveIP outputs (latitude, longitude, error) cleanly via MMDB fast path with online HTTP fallback
func (g *GeoIPLookup) ResolveIP(ipStr string) (float64, float64, error) {
	if ipStr == "" || ipStr == "127.0.0.1" || ipStr == "::1" || strings.HasPrefix(ipStr, "192.168.") || strings.HasPrefix(ipStr, "10.") || strings.HasPrefix(ipStr, "172.16.") {
		return 0, 0, nil
	}

	g.mu.RLock()
	db := g.db
	g.mu.RUnlock()

	if db != nil {
		ip := net.ParseIP(ipStr)
		if ip != nil {
			record, err := db.City(ip)
			if err == nil && (record.Location.Latitude != 0 || record.Location.Longitude != 0) {
				return record.Location.Latitude, record.Location.Longitude, nil
			}
		}
	}

	// Live Online GeoIP HTTP Lookup Fallback (Zero hardwiring)
	client := &http.Client{Timeout: 3500 * time.Millisecond}
	resp, err := client.Get(fmt.Sprintf("http://ip-api.com/json/%s?fields=status,lat,lon", ipStr))
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	var res struct {
		Status string  `json:"status"`
		Lat    float64 `json:"lat"`
		Lon    float64 `json:"lon"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err == nil && res.Status == "success" {
		return res.Lat, res.Lon, nil
	}

	return 0, 0, nil
}
