package dewi

import (
	"sync"
	"sync/atomic"
)

// MetricsCollector tracks Prometheus-style counters for DeWi adapters.
type MetricsCollector struct {
	mu           sync.RWMutex
	packetsIn    map[Protocol]*int64
	packetsFail  map[Protocol]*int64
	bytesRouted  map[Protocol]*uint64
	restarts     map[Protocol]*int64
}

func NewMetricsCollector() *MetricsCollector {
	m := &MetricsCollector{
		packetsIn:   make(map[Protocol]*int64),
		packetsFail: make(map[Protocol]*int64),
		bytesRouted: make(map[Protocol]*uint64),
		restarts:    make(map[Protocol]*int64),
	}

	protocols := []Protocol{ProtocolReticulum, ProtocolMeshtastic, ProtocolLoRaWAN, ProtocolAPRS}
	for _, p := range protocols {
		var in, fail, restart int64
		var bytes uint64
		m.packetsIn[p] = &in
		m.packetsFail[p] = &fail
		m.bytesRouted[p] = &bytes
		m.restarts[p] = &restart
	}
	return m
}

func (m *MetricsCollector) IncPacketsIn(p Protocol) {
	if ptr, ok := m.packetsIn[p]; ok {
		atomic.AddInt64(ptr, 1)
	}
}

func (m *MetricsCollector) IncPacketsFail(p Protocol) {
	if ptr, ok := m.packetsFail[p]; ok {
		atomic.AddInt64(ptr, 1)
	}
}

func (m *MetricsCollector) AddBytesRouted(p Protocol, n uint64) {
	if ptr, ok := m.bytesRouted[p]; ok {
		atomic.AddUint64(ptr, n)
	}
}

func (m *MetricsCollector) IncRestarts(p Protocol) {
	if ptr, ok := m.restarts[p]; ok {
		atomic.AddInt64(ptr, 1)
	}
}

func (m *MetricsCollector) GetMetrics(p Protocol) AdapterMetrics {
	var in, fail, restart int64
	var bytes uint64

	if ptr, ok := m.packetsIn[p]; ok {
		in = atomic.LoadInt64(ptr)
	}
	if ptr, ok := m.packetsFail[p]; ok {
		fail = atomic.LoadInt64(ptr)
	}
	if ptr, ok := m.bytesRouted[p]; ok {
		bytes = atomic.LoadUint64(ptr)
	}
	if ptr, ok := m.restarts[p]; ok {
		restart = atomic.LoadInt64(ptr)
	}

	return AdapterMetrics{
		PacketsInTotal:   in,
		PacketsFailTotal: fail,
		BytesRoutedTotal: bytes,
		RestartsTotal:    restart,
	}
}
