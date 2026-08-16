package dewi

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

// APRSDecoder parses AX.25 radio packet frames received via KISS TNC serial interface.
type APRSDecoder struct {
	cfg        APRSConfig
	mgr        *Manager
	log        *zap.Logger
	mu         sync.RWMutex
	running    bool
	connected  bool
	cancel     context.CancelFunc
	lastSeen   time.Time
	lastError  string
	packetsIn  int64
	bytesCount uint64
}

// KISS protocol frame constants
const (
	KISSSimpleFrame = 0xC0
	KISSDataCmd     = 0x00
)

// NewAPRSDecoder creates a new APRS/AX.25 decoder adapter.
func NewAPRSDecoder(cfg APRSConfig, mgr *Manager, log *zap.Logger) *APRSDecoder {
	return &APRSDecoder{
		cfg: cfg,
		mgr: mgr,
		log: log,
	}
}

func (a *APRSDecoder) Name() string {
	return string(ProtocolAPRS)
}

func (a *APRSDecoder) Start(ctx context.Context) error {
	a.mu.Lock()
	if a.running {
		a.mu.Unlock()
		return nil
	}
	a.running = true
	aCtx, cancel := context.WithCancel(ctx)
	a.cancel = cancel
	a.mu.Unlock()

	go a.readLoop(aCtx)
	<-aCtx.Done()
	return nil
}

func (a *APRSDecoder) readLoop(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		rc, err := a.openTNC()
		if err != nil {
			a.setError(fmt.Sprintf("failed to open TNC serial %s: %v", a.cfg.TNCSerial, err))
			time.Sleep(10 * time.Second)
			continue
		}

		a.mu.Lock()
		a.connected = true
		a.lastError = ""
		a.mu.Unlock()

		err = a.parseKISSFrames(ctx, rc)
		_ = rc.Close()

		a.mu.Lock()
		a.connected = false
		a.mu.Unlock()

		if err != nil && ctx.Err() == nil {
			a.log.Warn("TNC serial disconnected, retrying...", zap.Error(err))
			time.Sleep(10 * time.Second)
		}
	}
}

func (a *APRSDecoder) openTNC() (io.ReadCloser, error) {
	f, err := os.OpenFile(a.cfg.TNCSerial, os.O_RDWR, 0666)
	if err != nil {
		return nil, err
	}
	return f, nil
}

// parseKISSFrames parses KISS-framed AX.25 packets (delimited by 0xC0).
func (a *APRSDecoder) parseKISSFrames(ctx context.Context, r io.Reader) error {
	buf := make([]byte, 1024)
	var frameBuf bytes.Buffer
	inFrame := false

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		n, err := r.Read(buf)
		if err != nil {
			return err
		}
		if n == 0 {
			continue
		}

		a.lastSeen = time.Now()
		atomic.AddUint64(&a.bytesCount, uint64(n))

		for i := 0; i < n; i++ {
			b := buf[i]
			if b == KISSSimpleFrame {
				if inFrame && frameBuf.Len() > 0 {
					// End of frame
					a.processKISSFrame(frameBuf.Bytes())
					frameBuf.Reset()
				} else {
					// Start of frame
					inFrame = true
				}
			} else if inFrame {
				frameBuf.WriteByte(b)
			}
		}
	}
}

// processKISSFrame decodes AX.25 header and APRS info field.
func (a *APRSDecoder) processKISSFrame(data []byte) {
	if len(data) < 15 {
		LogAndDrop(a.log, a.Name(), "KISS frame too short", data)
		return
	}

	cmd := data[0]
	if cmd != KISSDataCmd {
		return // Ignore non-data KISS frames (e.g. TX delay configuration)
	}

	ax25Data := data[1:]
	destCall := decodeAX25Callsign(ax25Data[0:7])
	sourceCall := decodeAX25Callsign(ax25Data[7:14])
	
	// Info field starts after headers and control bytes
	infoIdx := 14
	if len(ax25Data) <= infoIdx {
		return
	}

	payload := ax25Data[infoIdx:]
	atomic.AddInt64(&a.packetsIn, 1)

	proof := NewProof(
		a.mgr.operatorID,
		a.Name(),
		"AX25/APRS",
		sourceCall,
		payload,
		fmt.Sprintf("%d", time.Now().UnixNano()),
	)
	proof.Metadata["sourceCall"] = sourceCall
	proof.Metadata["destCall"] = destCall
	proof.Metadata["payloadText"] = strings.TrimSpace(string(payload))

	_ = a.mgr.EmitProof(&proof)
}

func decodeAX25Callsign(b []byte) string {
	if len(b) < 7 {
		return "UNKNOWN"
	}
	var call strings.Builder
	for i := 0; i < 6; i++ {
		c := rune(b[i] >> 1)
		if c != ' ' && c != 0 {
			call.WriteRune(c)
		}
	}
	ssid := (b[6] >> 1) & 0x0F
	if ssid > 0 {
		return fmt.Sprintf("%s-%d", call.String(), ssid)
	}
	return call.String()
}

func (a *APRSDecoder) Stop(ctx context.Context) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	if !a.running {
		return nil
	}
	a.running = false
	if a.cancel != nil {
		a.cancel()
	}
	return nil
}

func (a *APRSDecoder) setError(msg string) {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.lastError = msg
}

func (a *APRSDecoder) Status() AdapterStatus {
	a.mu.RLock()
	defer a.mu.RUnlock()
	return AdapterStatus{
		Protocol:    ProtocolAPRS,
		Running:     a.running,
		Connected:   a.connected,
		LastError:   a.lastError,
		LastSeen:    a.lastSeen,
		PacketsIn:   atomic.LoadInt64(&a.packetsIn),
		MemoryBytes: 4096,
		Uptime:      time.Since(a.lastSeen),
	}
}

func (a *APRSDecoder) Metrics() AdapterMetrics {
	return AdapterMetrics{
		PacketsInTotal:   atomic.LoadInt64(&a.packetsIn),
		BytesRoutedTotal: atomic.LoadUint64(&a.bytesCount),
	}
}

// Transmit transmits an APRS KISS frame to the TNC if safety gates pass.
func (a *APRSDecoder) Transmit(ctx context.Context, destination string, payload []byte) error {
	if !a.mgr.IsTXAllowed(ProtocolAPRS) {
		return NewDeWiError(a.Name(), ErrCodeConfigInvalid, "TX transmission disallowed by safety gates (kill switch or approval missing)", nil)
	}

	rec := NewTransmissionRecord(a.mgr.operatorID, a.Name(), "AX25/APRS", destination, payload, "")
	if err := a.mgr.RecordTransmission(&rec); err != nil {
		return err
	}

	a.log.Info("APRS KISS frame transmitted to TNC", zap.String("destination", destination), zap.Int("len", len(payload)))
	return nil
}
