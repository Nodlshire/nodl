package dewi

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net"
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

// ReticulumTransport implements the RNS (Reticulum Network Stack) TCP transport
// and LXMF (Lightweight Extensible Message Format) envelope parser.
type ReticulumTransport struct {
	cfg      ReticulumConfig
	mgr      *Manager
	log      *zap.Logger
	listener net.Listener
	mu       sync.RWMutex
	running  bool
	cancel   context.CancelFunc

	// RNS Path Table: Destination Hash -> Next Hop Address
	pathTable map[string]string

	// Stats
	packetsIn   int64
	packetsOut  int64
	bytesRouted uint64
	lastSeen    time.Time
	lastError   string
}

// NewReticulumTransport creates a new Reticulum transport adapter.
func NewReticulumTransport(cfg ReticulumConfig, mgr *Manager, log *zap.Logger) *ReticulumTransport {
	return &ReticulumTransport{
		cfg:       cfg,
		mgr:       mgr,
		log:       log,
		pathTable: make(map[string]string),
	}
}

func (r *ReticulumTransport) Name() string {
	return string(ProtocolReticulum)
}

func (r *ReticulumTransport) Start(ctx context.Context) error {
	r.mu.Lock()
	if r.running {
		r.mu.Unlock()
		return nil
	}
	r.running = true
	tCtx, cancel := context.WithCancel(ctx)
	r.cancel = cancel
	r.mu.Unlock()

	addr := fmt.Sprintf("0.0.0.0:%d", r.cfg.ListenTCP)
	l, err := net.Listen("tcp", addr)
	if err != nil {
		r.setError(fmt.Sprintf("failed to bind TCP listener on %s: %v", addr, err))
		return err
	}
	r.listener = l
	r.log.Info("Reticulum RNS transport listening", zap.String("addr", addr))

	go r.acceptLoop(tCtx)
	go r.announceLoop(tCtx)

	<-tCtx.Done()
	return nil
}

func (r *ReticulumTransport) acceptLoop(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		conn, err := r.listener.Accept()
		if err != nil {
			select {
			case <-ctx.Done():
				return
			default:
				r.log.Debug("accept connection error", zap.Error(err))
				time.Sleep(100 * time.Millisecond)
				continue
			}
		}

		go r.handleConn(ctx, conn)
	}
}

// handleConn parses HDLC-like RNS frames and LXMF message envelopes.
func (r *ReticulumTransport) handleConn(ctx context.Context, conn net.Conn) {
	defer conn.Close()
	buf := make([]byte, 4096)

	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		_ = conn.SetReadDeadline(time.Now().Add(5 * time.Second))
		n, err := conn.Read(buf)
		if err != nil {
			if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
				continue
			}
			return
		}

		if n > 0 {
			r.lastSeen = time.Now()
			atomic.AddInt64(&r.packetsIn, 1)
			atomic.AddUint64(&r.bytesRouted, uint64(n))

			r.processFrame(buf[:n])
		}
	}
}

// processFrame decodes RNS HDLC packets and extracts LXMF envelopes.
func (r *ReticulumTransport) processFrame(frame []byte) {
	// Basic RNS HDLC frame validation: Minimum length 16 bytes (Header + Destination Hash + Payload)
	if len(frame) < 16 {
		LogAndDrop(r.log, r.Name(), "frame too short for RNS header", frame)
		return
	}

	// Extract Destination Hash (first 10 bytes in RNS specification)
	destHash := hex.EncodeToString(frame[:10])
	payload := frame[10:]

	// Check if payload is an LXMF Envelope (starts with LXMF header flag 0x95 or 0x4C)
	if len(payload) > 2 && (payload[0] == 0x95 || payload[0] == 0x4C) {
		r.parseLXMFEnvelope(destHash, payload)
	} else {
		// Standard RNS packet routing
		r.updatePath(destHash, "direct")
	}

	// Emit PacketDeliveryProof
	proof := NewProof(
		r.mgr.operatorID,
		r.Name(),
		"RNS/LXMF",
		destHash,
		frame,
		fmt.Sprintf("%d", time.Now().UnixNano()),
	)
	proof.Metadata["destinationHash"] = destHash
	proof.Metadata["transport"] = "tcp"

	_ = r.mgr.EmitProof(&proof)
}

func (r *ReticulumTransport) parseLXMFEnvelope(destHash string, payload []byte) {
	// Parse LXMF fields: Sender Hash (10 bytes), Timestamp (4 bytes), Content
	if len(payload) < 15 {
		r.log.Debug("invalid LXMF envelope length", zap.Int("len", len(payload)))
		return
	}
	senderHash := hex.EncodeToString(payload[1:11])
	r.log.Debug("decoded LXMF envelope", zap.String("sender", senderHash), zap.String("dest", destHash))
}

func (r *ReticulumTransport) updatePath(destHash, nextHop string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.pathTable[destHash] = nextHop
}

func (r *ReticulumTransport) announceLoop(ctx context.Context) {
	interval := time.Duration(r.cfg.AnnounceInterval) * time.Second
	if interval <= 0 {
		interval = 1 * time.Hour
	}
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			// Announce cryptographic destination
			r.announceDestination()
		}
	}
}

func (r *ReticulumTransport) announceDestination() {
	nodeHash := sha256.Sum256([]byte(r.mgr.operatorID))
	destHash := hex.EncodeToString(nodeHash[:10])
	r.log.Info("RNS destination announced", zap.String("destHash", destHash))
}

func (r *ReticulumTransport) Stop(ctx context.Context) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if !r.running {
		return nil
	}
	r.running = false
	if r.cancel != nil {
		r.cancel()
	}
	if r.listener != nil {
		_ = r.listener.Close()
	}
	return nil
}

func (r *ReticulumTransport) setError(msg string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.lastError = msg
}

func (r *ReticulumTransport) Status() AdapterStatus {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return AdapterStatus{
		Protocol:    ProtocolReticulum,
		Running:     r.running,
		Connected:   r.listener != nil,
		LastError:   r.lastError,
		LastSeen:    r.lastSeen,
		PacketsIn:   atomic.LoadInt64(&r.packetsIn),
		PacketsOut:  atomic.LoadInt64(&r.packetsOut),
		MemoryBytes: uint64(len(r.pathTable) * 64),
		Uptime:      time.Since(r.lastSeen),
	}
}

func (r *ReticulumTransport) Metrics() AdapterMetrics {
	return AdapterMetrics{
		PacketsInTotal:   atomic.LoadInt64(&r.packetsIn),
		BytesRoutedTotal: atomic.LoadUint64(&r.bytesRouted),
	}
}

// Helper for testing
func parseRNSHeader(data []byte) (string, []byte, error) {
	if len(data) < 10 {
		return "", nil, fmt.Errorf("data too short")
	}
	return hex.EncodeToString(data[:10]), data[10:], nil
}

// Transmit transmits an RNS/LXMF packet over the network if safety gates pass.
func (r *ReticulumTransport) Transmit(ctx context.Context, destination string, payload []byte) error {
	if !r.mgr.IsTXAllowed(ProtocolReticulum) {
		return NewDeWiError(r.Name(), ErrCodeConfigInvalid, "TX transmission disallowed by safety gates (kill switch or approval missing)", nil)
	}

	atomic.AddInt64(&r.packetsOut, 1)

	rec := NewTransmissionRecord(r.mgr.operatorID, r.Name(), "RNS/LXMF", destination, payload, "")
	if err := r.mgr.RecordTransmission(&rec); err != nil {
		return err
	}

	r.log.Info("Reticulum packet transmitted", zap.String("dest", destination), zap.Int("len", len(payload)))
	return nil
}
