package jobs

import (
	"crypto/rand"
	"io"
)

// XORStream applies a per-job ephemeral XOR key to an io.Reader.
type XORStream struct {
	key    []byte
	reader io.Reader
	pos    int
}

// NewXORStream creates a new XORStream wrapping the given reader with a key.
func NewXORStream(reader io.Reader, key []byte) *XORStream {
	return &XORStream{
		key:    key,
		reader: reader,
	}
}

// Read implements the io.Reader interface, applying XOR encryption on the fly.
func (s *XORStream) Read(p []byte) (n int, err error) {
	n, err = s.reader.Read(p)
	for i := 0; i < n; i++ {
		p[i] ^= s.key[s.pos%len(s.key)]
		s.pos++
	}
	return n, err
}

// GenerateEphemeralKey creates a secure 32-byte key for XOR streaming.
func GenerateEphemeralKey() ([]byte, error) {
	key := make([]byte, 32)
	_, err := rand.Read(key)
	return key, err
}
