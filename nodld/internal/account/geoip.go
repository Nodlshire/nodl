package account

import (
	"net"
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
