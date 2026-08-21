package contact

import "time"

type LeadTag string

const (
	TagBetaTester       LeadTag = "beta_tester"
	TagWaitlist         LeadTag = "waitlist"
	TagPersonaCreator   LeadTag = "persona_creator"
	TagPersonaFounder   LeadTag = "persona_founder"
	TagPersonaCommunity LeadTag = "persona_community"
	TagPersonaEarly     LeadTag = "persona_early_adopter"
)

type Lead struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message,omitempty"`
	Tag       LeadTag   `json:"tag"`
	Source    string    `json:"source"`
	CreatedAt time.Time `json:"createdAt"`
}

type ContactRequest struct {
	Name    string  `json:"name"`
	Email   string  `json:"email"`
	Message string  `json:"message"`
	Tag     LeadTag `json:"tag"`
	Source  string  `json:"source"`
}
