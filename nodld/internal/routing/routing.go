package routing

import (
	"errors"
	"fmt"
)

type RegionRouter struct {
	PrimaryRegion   string
	FallbackRegions []string
	AvailableRegions map[string]bool
}

func NewRegionRouter(primary string, fallbacks []string) *RegionRouter {
	rr := &RegionRouter{
		PrimaryRegion:   primary,
		FallbackRegions: fallbacks,
		AvailableRegions: make(map[string]bool),
	}
	rr.AvailableRegions[primary] = true
	for _, r := range fallbacks {
		rr.AvailableRegions[r] = true
	}
	return rr
}

func (rr *RegionRouter) SetRegionAvailability(region string, available bool) {
	rr.AvailableRegions[region] = available
}

func (rr *RegionRouter) GetTargetRegion() (string, error) {
	if rr.AvailableRegions[rr.PrimaryRegion] {
		return rr.PrimaryRegion, nil
	}
	
	for _, fallback := range rr.FallbackRegions {
		if rr.AvailableRegions[fallback] {
			return fallback, nil
		}
	}
	
	// Region isolation mode: if nothing available, attempt primary anyway or fail
	return "", errors.New("no regions available")
}

func (rr *RegionRouter) RouteRequest(upid string) (string, error) {
	return rr.GetTargetRegion()
}
