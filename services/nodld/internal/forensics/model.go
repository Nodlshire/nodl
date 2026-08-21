package forensics

import (
	"time"
)

// ForensicAction represents a categorized administrative or economic event.
type ForensicAction string

const (
	ActionAccountCreated           ForensicAction = "account_created"
	ActionAccountFrozen            ForensicAction = "account_frozen"
	ActionAccountUnfrozen          ForensicAction = "account_unfrozen"
	ActionFounderActivated         ForensicAction = "founder_activated"
	ActionOperatorActivated        ForensicAction = "operator_activated"
	ActionJobSubmitted             ForensicAction = "job_submitted"
	ActionJobCompleted             ForensicAction = "job_completed"
	ActionPayoutGenerated          ForensicAction = "payout_generated"
	ActionPayoutReleased           ForensicAction = "payout_released"
	ActionPayoutFrozen             ForensicAction = "payout_frozen"
	ActionPayoutUnfrozen           ForensicAction = "payout_unfrozen"
	ActionLineageLocked            ForensicAction = "lineage_locked"
	ActionAccountTransferRequested ForensicAction = "account_transfer_requested"
	ActionAccountTransferAuthorized ForensicAction = "account_transfer_authorized"
	ActionAccountTransferRejected  ForensicAction = "account_transfer_rejected"
	ActionOwnerRoleTransferred      ForensicAction = "owner_role_transferred"
	ActionManagementRoleChanged    ForensicAction = "management_role_changed"
	ActionCSSRoleChanged           ForensicAction = "customer_service_role_changed"
)

// Event is the core forensic record. It is append-only and cryptographically signed.
type Event struct {
	ID              string         `json:"id"`             // UUIDv7
	Timestamp       time.Time      `json:"timestamp"`      // UTC
	ActorAccountID  string         `json:"actorAccountId"`
	ActorRole       string         `json:"actorRole"`
	ActionType      ForensicAction `json:"actionType"`
	ActionPayload   string         `json:"actionPayload"`  // JSON stringified
	IPHash          string         `json:"ipHash"`         // SHA256 hashed and salted
	Signature       string         `json:"signature"`      // HMAC-SHA256 signature
	IsVerified      bool           `json:"isVerified"`     // Computed during read
}
