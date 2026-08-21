// Package buffer provides a RAM-only, encrypted, TTL-enforced buffer manager
// for Mesh compute job payloads. No payload is ever written to disk.
package buffer

import (
	"context"
	"crypto/rand"
	"fmt"
	"io"
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

// ManagerConfig holds the configuration for the buffer manager.
type ManagerConfig struct {
	// MaxPayloadSize is the maximum allowed size for a single job payload in bytes.
	MaxPayloadSize int64

	// MaxTotalMemory is the maximum total memory across all buffered payloads in bytes.
	MaxTotalMemory int64

	// TTL is the maximum time a payload can remain buffered before auto-expiry.
	TTL time.Duration

	// MaxRetries is the number of times a node can retry fetching a payload.
	MaxRetries int

	// RAMOnlyMode is an assertion flag. When true, the system asserts that
	// no disk-based storage is used for job payloads.
	RAMOnlyMode bool
}

// DefaultConfig returns a sensible default configuration.
func DefaultConfig() ManagerConfig {
	return ManagerConfig{
		MaxPayloadSize: 50 * 1024 * 1024,  // 50 MB
		MaxTotalMemory: 512 * 1024 * 1024, // 512 MB
		TTL:            5 * time.Minute,
		MaxRetries:     1,
		RAMOnlyMode:    true,
	}
}

// BufferEntry holds an encrypted payload in RAM.
type BufferEntry struct {
	JobID      string
	data       []byte // XOR-encrypted payload
	key        []byte // XOR key (same length as data)
	size       int64  // original payload size
	CreatedAt  time.Time
	Delivered  bool
	RetryCount int
}

// BufferStats provides observability into buffer state without exposing payloads.
type BufferStats struct {
	EntryCount      int   `json:"entryCount"`
	TotalMemory     int64 `json:"totalMemory"`
	MaxTotalMemory  int64 `json:"maxTotalMemory"`
	MaxPayloadSize  int64 `json:"maxPayloadSize"`
	TTLSeconds      int   `json:"ttlSeconds"`
	DeliveredCount  int   `json:"deliveredCount"`
	ExpiredCount    int64 `json:"expiredCount"`
}

// Manager is a thread-safe, RAM-only buffer manager for job payloads.
// It encrypts payloads at rest using XOR, enforces size and TTL limits,
// and ensures payloads are wiped (zeroed) after delivery or expiry.
type Manager struct {
	mu           sync.RWMutex
	buffers      map[string]*BufferEntry
	config       ManagerConfig
	log          *zap.Logger
	totalMemory  int64 // current total buffered memory
	expiredCount int64 // atomic counter for expired entries
}

// NewManager creates a new buffer manager with the given configuration.
func NewManager(cfg ManagerConfig, log *zap.Logger) *Manager {
	return &Manager{
		buffers: make(map[string]*BufferEntry),
		config:  cfg,
		log:     log,
	}
}

// Store encrypts and stores a payload in RAM, keyed by jobID.
// Returns an error if the payload exceeds size limits or total memory is exhausted.
// The caller's original byte slice is NOT zeroed by this function — the caller
// should zero it immediately after calling Store.
func (m *Manager) Store(jobID string, payload []byte) error {
	size := int64(len(payload))

	if size == 0 {
		return fmt.Errorf("empty payload rejected")
	}

	if size > m.config.MaxPayloadSize {
		m.log.Warn("payload rejected: exceeds max size",
			zap.String("jobID", jobID),
			zap.Int64("size", size),
			zap.Int64("maxSize", m.config.MaxPayloadSize),
		)
		return fmt.Errorf("payload size %d exceeds maximum %d", size, m.config.MaxPayloadSize)
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	// Check total memory budget
	if m.totalMemory+size > m.config.MaxTotalMemory {
		m.log.Warn("payload rejected: total memory exceeded",
			zap.String("jobID", jobID),
			zap.Int64("currentTotal", m.totalMemory),
			zap.Int64("payloadSize", size),
			zap.Int64("maxTotal", m.config.MaxTotalMemory),
		)
		return fmt.Errorf("total memory budget exceeded")
	}

	// Check for duplicate
	if _, exists := m.buffers[jobID]; exists {
		return fmt.Errorf("buffer already exists for job %s", jobID)
	}

	// Generate random XOR key
	key := make([]byte, len(payload))
	if _, err := rand.Read(key); err != nil {
		return fmt.Errorf("failed to generate encryption key: %w", err)
	}

	// Encrypt: XOR payload with key
	encrypted := make([]byte, len(payload))
	for i := range payload {
		encrypted[i] = payload[i] ^ key[i]
	}

	entry := &BufferEntry{
		JobID:     jobID,
		data:      encrypted,
		key:       key,
		size:      size,
		CreatedAt: time.Now(),
	}

	m.buffers[jobID] = entry
	m.totalMemory += size

	m.log.Info("payload buffered",
		zap.String("jobID", jobID),
		zap.Int64("size", size),
		zap.Int("totalEntries", len(m.buffers)),
	)

	return nil
}

// Stream returns an io.Reader that decrypts the buffered payload for the given jobID,
// along with a cleanup function that MUST be called after the stream is fully consumed.
// The cleanup function zeros all buffer bytes and removes the entry.
//
// If the job has already been delivered and retries are exhausted, returns an error.
func (m *Manager) Stream(jobID string) (io.Reader, func(), error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	entry, exists := m.buffers[jobID]
	if !exists {
		return nil, nil, fmt.Errorf("no buffer found for job %s", jobID)
	}

	if entry.Delivered && entry.RetryCount >= m.config.MaxRetries {
		return nil, nil, fmt.Errorf("payload already delivered and retries exhausted for job %s", jobID)
	}

	// Decrypt: XOR encrypted data with key
	decrypted := make([]byte, len(entry.data))
	for i := range entry.data {
		decrypted[i] = entry.data[i] ^ entry.key[i]
	}

	// Build cleanup function
	cleanup := func() {
		m.mu.Lock()
		defer m.mu.Unlock()
		m.wipeEntryLocked(jobID)
	}

	// Mark as delivered, increment retry count
	entry.Delivered = true
	entry.RetryCount++

	m.log.Info("payload streaming initiated",
		zap.String("jobID", jobID),
		zap.Int64("size", entry.size),
	)

	reader := &bufferReader{data: decrypted, pos: 0}
	return reader, cleanup, nil
}

// Wipe explicitly zeros all buffer bytes for the given jobID and removes the entry.
func (m *Manager) Wipe(jobID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.wipeEntryLocked(jobID)
}

// wipeEntryLocked zeros all bytes in the entry and removes it from the map.
// Caller MUST hold m.mu.
func (m *Manager) wipeEntryLocked(jobID string) {
	entry, exists := m.buffers[jobID]
	if !exists {
		return
	}

	// Zero the encrypted data
	for i := range entry.data {
		entry.data[i] = 0
	}
	// Zero the key
	for i := range entry.key {
		entry.key[i] = 0
	}

	m.totalMemory -= entry.size
	delete(m.buffers, jobID)

	m.log.Info("payload wiped",
		zap.String("jobID", jobID),
		zap.Int64("freedBytes", entry.size),
	)
}

// Has returns true if a buffer exists for the given jobID.
func (m *Manager) Has(jobID string) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()
	_, exists := m.buffers[jobID]
	return exists
}

// Stats returns observability metrics about the buffer state.
// No payload content is ever included.
func (m *Manager) Stats() BufferStats {
	m.mu.RLock()
	defer m.mu.RUnlock()

	delivered := 0
	for _, e := range m.buffers {
		if e.Delivered {
			delivered++
		}
	}

	return BufferStats{
		EntryCount:     len(m.buffers),
		TotalMemory:    m.totalMemory,
		MaxTotalMemory: m.config.MaxTotalMemory,
		MaxPayloadSize: m.config.MaxPayloadSize,
		TTLSeconds:     int(m.config.TTL.Seconds()),
		DeliveredCount: delivered,
		ExpiredCount:   atomic.LoadInt64(&m.expiredCount),
	}
}

// RunReaper runs a background goroutine that periodically checks for and wipes
// expired buffer entries. It runs until ctx is cancelled.
func (m *Manager) RunReaper(ctx context.Context) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	m.log.Info("buffer reaper started",
		zap.Duration("ttl", m.config.TTL),
		zap.Duration("interval", 30*time.Second),
	)

	for {
		select {
		case <-ctx.Done():
			m.log.Info("buffer reaper stopped")
			return
		case <-ticker.C:
			m.reap()
		}
	}
}

// reap checks all entries and wipes those that have exceeded TTL.
func (m *Manager) reap() {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	var expired []string

	for jobID, entry := range m.buffers {
		if now.Sub(entry.CreatedAt) > m.config.TTL {
			expired = append(expired, jobID)
		}
	}

	for _, jobID := range expired {
		m.log.Warn("TTL expired, wiping buffer",
			zap.String("jobID", jobID),
		)
		m.wipeEntryLocked(jobID)
		atomic.AddInt64(&m.expiredCount, 1)
	}
}

// ReapNow triggers an immediate reap cycle (used in tests).
func (m *Manager) ReapNow() {
	m.reap()
}

// bufferReader is a simple io.Reader over a byte slice.
type bufferReader struct {
	data []byte
	pos  int
}

func (r *bufferReader) Read(p []byte) (n int, err error) {
	if r.pos >= len(r.data) {
		return 0, io.EOF
	}
	n = copy(p, r.data[r.pos:])
	r.pos += n
	return n, nil
}
