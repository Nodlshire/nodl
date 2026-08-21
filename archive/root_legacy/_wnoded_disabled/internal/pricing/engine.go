package pricing

import (
	"context"
	"fmt"
	"math"
	"sort"
	"sync"
	"time"

	"go.uber.org/zap"
)

type Store struct {
	mu    sync.RWMutex
	state *GlobalPricingState
}

func NewStore() *Store {
	s := &Store{
		state: &GlobalPricingState{
			Tiers: make(map[TierID]*TierState),
		},
	}

	// Initialize Nodl Global Matrix
	initialTiers := []*TierState{
		{ID: TierTiny, Name: "Tiny", RateTHSec: 0.0006, CPUCores: 4, GPUModel: "No GPU", RAMGB: 8, Description: "Entry-level sandbox compute"},
		{ID: TierStandard, Name: "Standard", RateTHSec: 0.0018, CPUCores: 16, GPUModel: "T4 GPU", RAMGB: 32, Description: "Balanced general purpose"},
		{ID: TierHighRAM, Name: "High RAM", RateTHSec: 0.0028, CPUCores: 16, GPUModel: "No GPU", RAMGB: 256, Description: "Data intensive workloads"},
		{ID: TierBoost, Name: "Boost", RateTHSec: 0.0042, CPUCores: 32, GPUModel: "RTX 4090", RAMGB: 64, Description: "High-performance GPU compute"},
		{ID: TierUltra, Name: "Ultra", RateTHSec: 0.0084, CPUCores: 64, GPUModel: "2x RTX 4090", RAMGB: 128, Description: "Multi-GPU extreme performance"},
		{ID: TierDeccTee, Name: "DECC/TEE", RateTHSec: 0.0120, CPUCores: 24, GPUModel: "H100", RAMGB: 80, Description: "Encrypted confidential compute"},
	}

	for _, t := range initialTiers {
		t.LastUpdate = time.Now()
		s.state.Tiers[t.ID] = t
	}

	return s
}

func (s *Store) GetState() *GlobalPricingState {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.state
}

func (s *Store) UpdateTierState(id TierID, state *TierState) {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	// Maintain history (max 1000 points)
	if existing, ok := s.state.Tiers[id]; ok {
		state.History = append(existing.History, HistoryPoint{
			Price:      state.LiveMarket,
			Volatility: state.Volatility,
			Timestamp:  time.Now(),
		})
		if len(state.History) > 1000 {
			state.History = state.History[len(state.History)-1000:]
		}
	} else {
		state.History = []HistoryPoint{{
			Price:      state.LiveMarket,
			Volatility: state.Volatility,
			Timestamp:  time.Now(),
		}}
	}

	s.state.Tiers[id] = state
	s.state.LastUpdate = time.Now()
}

type Engine struct {
	store *Store
	log   *zap.Logger
}

func NewEngine(store *Store, log *zap.Logger) *Engine {
	return &Engine{
		store: store,
		log:   log,
	}
}

func (e *Engine) Run(ctx context.Context) {
	e.log.Info("autonomous pricing engine starting")
	
	// Initial fetch
	e.refreshMarketData()

	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			e.log.Info("pricing engine stopping")
			return
		case <-ticker.C:
			e.refreshMarketData()
		}
	}
}

func (e *Engine) refreshMarketData() {
	e.log.Debug("refreshing market data")
	
	allRates := FetchAllMarketData()
	
	tiers := []TierID{TierTiny, TierStandard, TierHighRAM, TierBoost, TierUltra, TierDeccTee}
	for _, t := range tiers {
		e.updateTier(t, allRates)
	}
}

func (e *Engine) updateTier(id TierID, allRates []MarketRate) {
	sources := e.filterRatesForTier(id, allRates)
	if len(sources) == 0 {
		e.log.Warn("no market sources found for tier", zap.String("tier", string(id)))
		return
	}

	// 1. Normalization (IQR Outlier Removal)
	normalized := removeOutliersIQR(sources)
	
	// 2. Metrics
	median := calculateMedian(normalized)
	mean := calculateMean(normalized)
	vol := calculateVolatility(normalized)

	// 3. Get existing state for smoothing
	state := e.store.GetState()
	existing, _ := state.Tiers[id]
	
	// 4. Smoothing (SMA/EMA)
	smas := e.calculateSMAs(id, median, existing)
	ema := e.calculateEMA(median, existing)

	// 5. Auto-Tuning Rules
	rule := e.getRuleForTier(id, existing)
	effective := e.calculateEffectiveRate(median, smas, vol, rule)

	// 6. Alerts
	alerts := e.generateAlerts(id, median, existing)

	// 7. Update Store
	// Robust fallback for static specs (Master Directive)
	cores := 0
	gpu := "Unknown GPU"
	ram := 0
	desc := "Compute resource"
	name := string(id)

	switch id {
	case TierTiny:
		cores, gpu, ram, desc, name = 4, "No GPU", 8, "Lightweight compute for basic microservices and testing.", "Tiny"
	case TierStandard:
		cores, gpu, ram, desc, name = 16, "T4 GPU", 32, "Balanced performance for general-purpose workloads.", "Standard"
	case TierHighRAM:
		cores, gpu, ram, desc, name = 16, "No GPU", 256, "Memory-optimized instance for large datasets.", "High RAM"
	case TierBoost:
		cores, gpu, ram, desc, name = 32, "RTX 4090", 64, "High-performance compute for demanding applications.", "Boost"
	case TierUltra:
		cores, gpu, ram, desc, name = 64, "2x RTX 4090", 128, "Maximum power for intensive processing tasks.", "Ultra"
	case TierDeccTee:
		cores, gpu, ram, desc, name = 24, "H100", 80, "Secure enclave with Trusted Execution Environment.", "DECC/TEE"
	}

	// Carry over from existing if valid, otherwise use defaults above
	if existing != nil {
		if existing.CPUCores > 0 { cores = existing.CPUCores }
		if existing.GPUModel != "" { gpu = existing.GPUModel }
		if existing.RAMGB > 0 { ram = existing.RAMGB }
		if existing.Description != "" { desc = existing.Description }
		if existing.Name != "" { name = existing.Name }
	}

	newState := &TierState{
		ID:            id,
		Name:          name,
		CPUCores:      cores,
		GPUModel:      gpu,
		RAMGB:         ram,
		Description:   desc,
		LiveMarket:    median,
		Mean:          mean,
		Volatility:    vol,
		EffectiveRate: effective,
		Rule:          rule,
		SMAs:          smas,
		EMA:           ema,
		Sources:       sources,
		Alerts:        alerts,
		LastUpdate:    time.Now(),
	}
	e.store.UpdateTierState(id, newState)
}

func (e *Engine) filterRatesForTier(id TierID, all []MarketRate) []MarketRate {
	var matches func(r MarketRate) bool
	switch id {
	case TierTiny:
		matches = func(r MarketRate) bool { return r.Price > 0 && r.Price < 0.02 }
	case TierStandard:
		matches = func(r MarketRate) bool { return r.Price >= 0.02 && r.Price < 0.10 }
	case TierHighRAM:
		matches = func(r MarketRate) bool { return r.Price >= 0.10 && r.Price < 0.20 }
	case TierBoost:
		matches = func(r MarketRate) bool { return r.Price >= 0.20 && r.Price < 0.60 }
	case TierUltra:
		matches = func(r MarketRate) bool { return r.Price >= 0.60 && r.Price < 2.00 }
	case TierDeccTee:
		matches = func(r MarketRate) bool { return r.Price >= 2.00 }
	}

	result := []MarketRate{}
	for _, r := range all {
		if matches(r) {
			result = append(result, r)
		}
	}
	return result
}

func (e *Engine) getRuleForTier(id TierID, existing *TierState) PricingRule {
	if existing != nil {
		return existing.Rule
	}
	return PricingRule{
		Mode:       "follow_market",
		Multiplier: 1.0,
	}
}

func removeOutliersIQR(rates []MarketRate) []MarketRate {
	if len(rates) < 4 {
		return rates
	}
	
	prices := make([]float64, len(rates))
	for i, r := range rates {
		prices[i] = r.Price
	}
	sort.Float64s(prices)

	q1 := prices[len(prices)/4]
	q3 := prices[len(prices)*3/4]
	iqr := q3 - q1
	
	lower := q1 - 1.5*iqr
	upper := q3 + 1.5*iqr

	result := []MarketRate{}
	for _, r := range rates {
		if r.Price >= lower && r.Price <= upper {
			result = append(result, r)
		}
	}
	return result
}

func calculateMedian(rates []MarketRate) float64 {
	if len(rates) == 0 { return 0 }
	prices := make([]float64, len(rates))
	for i, r := range rates { prices[i] = r.Price }
	sort.Float64s(prices)
	n := len(prices)
	if n%2 == 1 { return prices[n/2] }
	return (prices[n/2-1] + prices[n/2]) / 2
}

func calculateMean(rates []MarketRate) float64 {
	if len(rates) == 0 { return 0 }
	sum := 0.0
	for _, r := range rates { sum += r.Price }
	return sum / float64(len(rates))
}

func calculateVolatility(rates []MarketRate) float64 {
	if len(rates) < 2 { return 0 }
	mean := calculateMean(rates)
	sumSq := 0.0
	for _, r := range rates {
		sumSq += (r.Price - mean) * (r.Price - mean)
	}
	return math.Sqrt(sumSq / float64(len(rates)-1))
}

func (e *Engine) calculateSMAs(id TierID, current float64, existing *TierState) SMAState {
	if existing == nil || len(existing.History) == 0 {
		return SMAState{M5: current, M15: current, H1: current}
	}
	
	// SMA implementation using history
	h := existing.History
	return SMAState{
		M5:  calculateAvg(h, 1, current),  // 1 point (5m)
		M15: calculateAvg(h, 3, current),  // 3 points (15m)
		H1:  calculateAvg(h, 12, current), // 12 points (1h)
	}
}

func calculateAvg(h []HistoryPoint, window int, current float64) float64 {
	sum := current
	count := 1
	for i := len(h) - 1; i >= 0 && count < window; i-- {
		sum += h[i].Price
		count++
	}
	return sum / float64(count)
}

func (e *Engine) calculateEMA(current float64, existing *TierState) float64 {
	if existing == nil { return current }
	alpha := 0.3 // Smoothing factor
	return alpha*current + (1-alpha)*existing.EMA
}

func (e *Engine) calculateEffectiveRate(median float64, smas SMAState, vol float64, rule PricingRule) float64 {
	if rule.Mode == "manual" {
		return rule.ManualOverride
	}

	res := median
	if rule.Mode == "auto_tune" {
		switch rule.AutoTuneMode {
		case "undercut":
			res = median * (1 - rule.TargetPercent/100.0)
		case "top_n":
			// Simplified: Top N% maps to a multiplier above median for now
			res = median * (1 + (100-rule.TargetPosition)/200.0)
		case "volatility_adaptive":
			// Increase price if volatility is high to buffer risk
			res = median * (1 + vol*2)
		}
	} else {
		// follow_market
		res = median * rule.Multiplier
		res += res * (rule.PercentOffset / 100.0)
	}

	// Volatility smoothing (dampen spikes > 2 std dev)
	if vol > 0 && math.Abs(res-smas.M15) > 2*vol {
		res = smas.M15 + (res-smas.M15)*0.5 // Dampen by 50%
	}

	// Safety limits
	if rule.Floor > 0 && res < rule.Floor { res = rule.Floor }
	if rule.Ceiling > 0 && res > rule.Ceiling { res = rule.Ceiling }
	
	return res
}

func (e *Engine) generateAlerts(id TierID, current float64, existing *TierState) []Alert {
	alerts := []Alert{}
	if existing == nil { return alerts }
	
	// Market Spike/Drop (> 20%)
	if existing.LiveMarket > 0 {
		change := (current - existing.LiveMarket) / existing.LiveMarket
		if math.Abs(change) > 0.2 {
			level := AlertWarning
			if math.Abs(change) > 0.5 { level = AlertCritical }
			msg := fmt.Sprintf("Significant market shift: %.1f%%", change*100)
			alerts = append(alerts, Alert{TierID: id, Level: level, Message: msg, Timestamp: time.Now()})
		}
	}
	
	// Carry over recent valid alerts
	for _, a := range existing.Alerts {
		if time.Since(a.Timestamp) < 1*time.Hour {
			alerts = append(alerts, a)
		}
	}
	
	return alerts
}
