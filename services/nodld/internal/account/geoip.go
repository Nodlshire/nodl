package account

import (
	"net"
	"strings"
	"sync"

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

// ResolveIP outputs (latitude, longitude, error) cleanly via mmap fast paths
func (g *GeoIPLookup) ResolveIP(ipStr string) (float64, float64, error) {
	g.mu.RLock()
	defer g.mu.RUnlock()

	if g.db == nil {
		// Silent graceful fallback if the database file is not yet deployed on disk
		return 0, 0, nil
	}

	ip := net.ParseIP(ipStr)
	record, err := g.db.City(ip)
	if err != nil {
		return 0, 0, err
	}

	return record.Location.Latitude, record.Location.Longitude, nil
}
