package dewi

import (
	"fmt"
	"time"

	"go.uber.org/zap"
)

// DeWiError is the structured error type for all adapters.
// Adapters MUST never panic on malformed frames — log and drop instead.
type DeWiError struct {
	Adapter   string    `json:"adapter"`
	Code      string    `json:"code"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Raw       []byte    `json:"-"` // the offending frame (truncated to 256 bytes max)
}

func (e *DeWiError) Error() string {
	return fmt.Sprintf("[dewi:%s] %s: %s", e.Adapter, e.Code, e.Message)
}

// Error codes used across all adapters.
const (
	ErrCodeSerialOpen       = "SERIAL_OPEN_FAILED"
	ErrCodeSerialRead       = "SERIAL_READ_FAILED"
	ErrCodeSerialDisconnect = "SERIAL_DISCONNECTED"
	ErrCodeFrameMalformed   = "FRAME_MALFORMED"
	ErrCodeFrameTruncated   = "FRAME_TRUNCATED"
	ErrCodeFrameOversized   = "FRAME_OVERSIZED"
	ErrCodeCRCFailed        = "CRC_FAILED"
	ErrCodeProtobufDecode   = "PROTOBUF_DECODE_FAILED"
	ErrCodeSignatureInvalid = "SIGNATURE_INVALID"
	ErrCodeConnectionFailed = "CONNECTION_FAILED"
	ErrCodeConnectionLost   = "CONNECTION_LOST"
	ErrCodeBindFailed       = "BIND_FAILED"
	ErrCodeConfigInvalid    = "CONFIG_INVALID"
	ErrCodeProofEmitFailed  = "PROOF_EMIT_FAILED"
	ErrCodeAdapterCrashed   = "ADAPTER_CRASHED"
	ErrCodeBackpressure     = "BACKPRESSURE"
)

// NewDeWiError creates a new DeWiError, truncating raw frame data to 256 bytes.
func NewDeWiError(adapter, code, message string, raw []byte) *DeWiError {
	truncated := raw
	if len(raw) > 256 {
		truncated = raw[:256]
	}
	return &DeWiError{
		Adapter:   adapter,
		Code:      code,
		Message:   message,
		Timestamp: time.Now().UTC(),
		Raw:       truncated,
	}
}

// LogError writes a structured DeWiError to the zap logger without panicking.
func LogError(log *zap.Logger, err *DeWiError) {
	log.Error("dewi adapter error",
		zap.String("adapter", err.Adapter),
		zap.String("code", err.Code),
		zap.String("message", err.Message),
		zap.Time("timestamp", err.Timestamp),
		zap.Int("rawBytes", len(err.Raw)),
	)
}

// LogAndDrop logs a malformed frame error and returns nil (the frame is silently dropped).
// This is the canonical error handling path for all adapters receiving bad data.
func LogAndDrop(log *zap.Logger, adapter, message string, raw []byte) {
	LogError(log, NewDeWiError(adapter, ErrCodeFrameMalformed, message, raw))
}
