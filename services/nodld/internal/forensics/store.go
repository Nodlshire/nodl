package forensics

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sort"
	"sync"
	"time"

	"github.com/google/uuid"
)

type Store struct {
	mu     sync.RWMutex
	secret string
	salt   string
	events []Event
}

func NewStore(secret, salt string) *Store {
	return &Store{
		secret: secret,
		salt:   salt,
		events: make([]Event, 0),
	}
}

// LogEvent creates, signs, and appends a new forensic record.
func (s *Store) LogEvent(actorID, actorRole string, action ForensicAction, payload interface{}, ip string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	payloadBytes, _ := json.Marshal(payload)
	
	id, _ := uuid.NewV7()
	
	// Salted IP hash
	ipHasher := sha256.New()
	ipHasher.Write([]byte(s.salt + ip))
	ipHash := hex.EncodeToString(ipHasher.Sum(nil))

	event := Event{
		ID:             id.String(),
		Timestamp:      time.Now().UTC(),
		ActorAccountID: actorID,
		ActorRole:      actorRole,
		ActionType:     action,
		ActionPayload:  string(payloadBytes),
		IPHash:         ipHash,
	}

	// Sign the event content
	event.Signature = s.signEvent(event)
	
	s.events = append(s.events, event)
	return nil
}

// ListEvents returns all logged events. 
func (s *Store) ListEvents() []Event {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	// Create a copy and verify signatures
	out := make([]Event, len(s.events))
	for i, e := range s.events {
		e.IsVerified = (e.Signature == s.signEvent(e))
		out[i] = e
	}
	
	// Sort by timestamp descending
	sort.Slice(out, func(i, j int) bool {
		return out[i].Timestamp.After(out[j].Timestamp)
	})
	
	return out
}

func (s *Store) GetEvent(id string) (*Event, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	for _, e := range s.events {
		if e.ID == id {
			e.IsVerified = (e.Signature == s.signEvent(e))
			return &e, nil
		}
	}
	return nil, fmt.Errorf("event not found")
}

// signEvent generates an HMAC-SHA256 signature for the immutable parts of the event.
func (s *Store) signEvent(e Event) string {
	h := hmac.New(sha256.New, []byte(s.secret))
	// Build signing string using immutable fields
	data := fmt.Sprintf("%s|%s|%s|%s|%s|%s|%s",
		e.ID,
		e.Timestamp.Format(time.RFC3339),
		e.ActorAccountID,
		e.ActorRole,
		string(e.ActionType),
		e.ActionPayload,
		e.IPHash,
	)
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}
