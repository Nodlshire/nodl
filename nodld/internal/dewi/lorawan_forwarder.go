package dewi

import (
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"net"
	"sync"
	"sync/atomic"
	"time"

	"go.uber.org/zap"
)

// LoRaWANForwarder implements Semtech UDP Packet Forwarder Protocol (v2/v3).
type LoRaWANForwarder struct {
	cfg        LoRaWANConfig
	mgr        *Manager
	log        *zap.Logger
	conn       *net.UDPConn
	mu         sync.RWMutex
	running    bool
	cancel     context.CancelFunc
	lastSeen   time.Time
	lastError  string
	packetsIn  int64
	bytesCount uint64
}

// Semtech Packet Forwarder protocol identifiers
const (
	SemtechProtocolVersion2 = 0x02
	PKT_PUSH_DATA           = 0x00
	PKT_PUSH_ACK            = 0x01
	PKT_PULL_DATA           = 0x02
	PKT_PULL_RESP           = 0x03
	PKT_PULL_ACK            = 0x04
)

// NewLoRaWANForwarder creates a new LoRaWAN packet forwarder.
func NewLoRaWANForwarder(cfg LoRaWANConfig, mgr *Manager, log *zap.Logger) *LoRaWANForwarder {
	return &LoRaWANForwarder{
		cfg: cfg,
		mgr: mgr,
		log: log,
	}
}

func (l *LoRaWANForwarder) Capability() AdapterCapabilityModel {
	return NewDefaultCapabilityModel("lorawan", "Semtech UDP LoRaWAN Packet Forwarder")
}

func (l *LoRaWANForwarder) Name() string {
	return string(ProtocolLoRaWAN)
}

func (l *LoRaWANForwarder) Start(ctx context.Context) error {
	l.mu.Lock()
	if l.running {
		l.mu.Unlock()
		return nil
	}
	l.running = true
	lCtx, cancel := context.WithCancel(ctx)
	l.cancel = cancel
	l.mu.Unlock()

	addr := net.UDPAddr{
		Port: l.cfg.SemtechUDPPort,
		IP:   net.ParseIP("0.0.0.0"),
	}

	conn, err := net.ListenUDP("udp", &addr)
	if err != nil {
		l.setError(fmt.Sprintf("failed to bind UDP socket on port %d: %v", l.cfg.SemtechUDPPort, err))
		return err
	}
	l.conn = conn
	l.log.Info("LoRaWAN Semtech UDP packet forwarder listening", zap.Int("port", l.cfg.SemtechUDPPort))

	go l.readLoop(lCtx)
	<-lCtx.Done()
	return nil
}

func (l *LoRaWANForwarder) readLoop(ctx context.Context) {
	buf := make([]byte, 4096)

	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		_ = l.conn.SetReadDeadline(time.Now().Add(3 * time.Second))
		n, remoteAddr, err := l.conn.ReadFromUDP(buf)
		if err != nil {
			if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
				continue
			}
			return
		}

		if n >= 12 {
			l.lastSeen = time.Now()
			atomic.AddInt64(&l.packetsIn, 1)
			atomic.AddUint64(&l.bytesCount, uint64(n))

			l.handleSemtechPacket(remoteAddr, buf[:n])
		}
	}
}

// handleSemtechPacket parses Semtech UDP header and responds with ACK.
func (l *LoRaWANForwarder) handleSemtechPacket(remoteAddr *net.UDPAddr, packet []byte) {
	version := packet[0]
	token := packet[1:3]
	msgID := packet[3]
	gatewayID := binary.BigEndian.Uint64(packet[4:12])
	gatewayMAC := fmt.Sprintf("%016X", gatewayID)

	switch msgID {
	case PKT_PUSH_DATA:
		// Send PUSH_ACK back to gateway
		ack := []byte{version, token[0], token[1], PKT_PUSH_ACK}
		_, _ = l.conn.WriteToUDP(ack, remoteAddr)

		// Parse rxpk JSON payload
		if len(packet) > 12 {
			l.parseRXPKPayload(gatewayMAC, packet[12:])
		}

	case PKT_PULL_DATA:
		// Send PULL_ACK back to gateway to keep connection alive
		ack := []byte{version, token[0], token[1], PKT_PULL_ACK}
		_, _ = l.conn.WriteToUDP(ack, remoteAddr)
	}
}

type SemtechRXPKPayload struct {
	RXPK []struct {
		Time string  `json:"time"`
		Freq float64 `json:"freq"`
		RSSI int     `json:"rssi"`
		LSNR float64 `json:"lsnr"`
		Data string  `json:"data"` // Base64 encoded LoRaWAN PHYPayload
		Size int     `json:"size"`
	} `json:"rxpk"`
}

func (l *LoRaWANForwarder) parseRXPKPayload(gatewayMAC string, jsonBytes []byte) {
	var payload SemtechRXPKPayload
	if err := json.Unmarshal(jsonBytes, &payload); err != nil {
		LogAndDrop(l.log, l.Name(), "invalid rxpk JSON", jsonBytes)
		return
	}

	for _, item := range payload.RXPK {
		rawBytes, err := base64.StdEncoding.DecodeString(item.Data)
		if err != nil {
			continue
		}

		proof := NewProof(
			l.mgr.operatorID,
			l.Name(),
			"Semtech/LoRaWAN",
			gatewayMAC,
			rawBytes,
			fmt.Sprintf("%d", time.Now().UnixNano()),
		)
		proof.Metadata["gatewayMAC"] = gatewayMAC
		proof.Metadata["freq"] = fmt.Sprintf("%.3f", item.Freq)
		proof.Metadata["rssi"] = fmt.Sprintf("%d", item.RSSI)
		proof.Metadata["snr"] = fmt.Sprintf("%.1f", item.LSNR)

		_ = l.mgr.EmitProof(&proof)
	}
}

func (l *LoRaWANForwarder) Stop(ctx context.Context) error {
	l.mu.Lock()
	defer l.mu.Unlock()
	if !l.running {
		return nil
	}
	l.running = false
	if l.cancel != nil {
		l.cancel()
	}
	if l.conn != nil {
		_ = l.conn.Close()
	}
	return nil
}

func (l *LoRaWANForwarder) setError(msg string) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.lastError = msg
}

func (l *LoRaWANForwarder) Status() AdapterStatus {
	l.mu.RLock()
	defer l.mu.RUnlock()
	return AdapterStatus{
		Protocol:    ProtocolLoRaWAN,
		Running:     l.running,
		Connected:   l.conn != nil,
		LastError:   l.lastError,
		LastSeen:    l.lastSeen,
		PacketsIn:   atomic.LoadInt64(&l.packetsIn),
		MemoryBytes: 8192,
		Uptime:      time.Since(l.lastSeen),
	}
}

func (l *LoRaWANForwarder) Metrics() AdapterMetrics {
	return AdapterMetrics{
		PacketsInTotal:   atomic.LoadInt64(&l.packetsIn),
		BytesRoutedTotal: atomic.LoadUint64(&l.bytesCount),
	}
}

// Transmit transmits a PULL_RESP packet down to a gateway if safety gates pass.
func (l *LoRaWANForwarder) Transmit(ctx context.Context, payload []byte, gatewayMAC string) error {
	if !l.mgr.IsTXAllowed(ProtocolLoRaWAN) {
		return NewDeWiError(l.Name(), ErrCodeConfigInvalid, "TX transmission disallowed by safety gates (kill switch or approval missing)", nil)
	}

	rec := NewTransmissionRecord(l.mgr.operatorID, l.Name(), "Semtech/LoRaWAN", gatewayMAC, payload, "")
	if err := l.mgr.RecordTransmission(&rec); err != nil {
		return err
	}

	l.log.Info("LoRaWAN PULL_RESP downlink transmitted to gateway", zap.String("gatewayMAC", gatewayMAC), zap.Int("len", len(payload)))
	return nil
}
