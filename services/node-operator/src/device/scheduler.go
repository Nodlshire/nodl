package device

import (
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

var (
	schedMu      sync.RWMutex
	schedIsPaused bool
)

// IsPausedBySchedule returns whether compute execution is currently paused by scheduler.
func IsPausedBySchedule() bool {
	schedMu.RLock()
	defer schedMu.RUnlock()
	return schedIsPaused
}

// IsWithinSchedule evaluates whether the given time falls inside the configured active schedule window.
func IsWithinSchedule(sched *platform.ScheduleConfig, now time.Time) bool {
	if sched == nil || !sched.Enabled {
		return true // If scheduler is disabled, node is active 24/7
	}

	// 1. Check Day of Week
	if len(sched.Days) > 0 {
		dayAbbrev := now.Format("Mon") // "Mon", "Tue", etc.
		dayMatched := false
		for _, d := range sched.Days {
			if strings.EqualFold(strings.TrimSpace(d), dayAbbrev) {
				dayMatched = true
				break
			}
		}
		if !dayMatched {
			return false
		}
	}

	// 2. Parse StartTime & EndTime (HH:MM 24-hour format)
	startMinutes, startErr := parseTimeMinutes(sched.StartTime)
	endMinutes, endErr := parseTimeMinutes(sched.EndTime)

	if startErr != nil || endErr != nil {
		return true // Fallback to active if format is invalid
	}

	currentMinutes := now.Hour()*60 + now.Minute()

	if startMinutes == endMinutes {
		return true // Full 24h active
	}

	if startMinutes < endMinutes {
		// Normal intra-day window (e.g. 09:00 to 17:00)
		return currentMinutes >= startMinutes && currentMinutes < endMinutes
	} else {
		// Overnight window (e.g. 23:00 to 07:00)
		return currentMinutes >= startMinutes || currentMinutes < endMinutes
	}
}

func parseTimeMinutes(tStr string) (int, error) {
	parts := strings.Split(strings.TrimSpace(tStr), ":")
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid time format: %s", tStr)
	}
	h, err1 := strconv.Atoi(parts[0])
	m, err2 := strconv.Atoi(parts[1])
	if err1 != nil || err2 != nil || h < 0 || h > 23 || m < 0 || m > 59 {
		return 0, fmt.Errorf("invalid time bounds: %s", tStr)
	}
	return h*60 + m, nil
}

// StartScheduleEnforcer starts a background 30s ticker checking current time vs ScheduleConfig.
// Invokes onStateChange callback whenever paused state transitions.
func StartScheduleEnforcer(state *platform.State, onStateChange func(isPaused bool)) {
	ticker := time.NewTicker(30 * time.Second)
	go func() {
		for {
			now := time.Now()
			active := IsWithinSchedule(state.Schedule, now)
			shouldPause := !active

			schedMu.Lock()
			changed := (schedIsPaused != shouldPause)
			schedIsPaused = shouldPause
			schedMu.Unlock()

			if changed && onStateChange != nil {
				platform.Info("Schedule state transition: paused=%v (active window: %v)", shouldPause, active)
				onStateChange(shouldPause)
			}

			<-ticker.C
		}
	}()
}
