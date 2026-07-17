package account

import (
	"hash/fnv"
)

func ResolveRegion(lat, lon float64) string {
	// Simple bounding box logic
	if lat >= 35.0 && lat <= 70.0 && lon >= -10.0 && lon <= 40.0 {
		return "EU"
	}
	if lat >= 25.0 && lat <= 49.0 && lon >= -125.0 && lon <= -65.0 {
		return "US"
	}
	if lat >= -10.0 && lat <= 45.0 && lon >= 60.0 && lon <= 150.0 {
		return "APAC"
	}
	if lat >= -55.0 && lat <= 25.0 && lon >= -80.0 && lon <= -35.0 {
		return "LATAM"
	}
	if lat >= -35.0 && lat <= 35.0 && lon >= -20.0 && lon <= 50.0 {
		return "AFRICA"
	}
	return "UNKNOWN"
}

func AssignShard(upid string) int {
	h := fnv.New32a()
	h.Write([]byte(upid))
	return int(h.Sum32() % 32)
}
