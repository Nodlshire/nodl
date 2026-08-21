package governance

import (
	"time"
	"github.com/obregan/nodl/nodld/internal/account"
)

type UserStatus string

const (
	StatusActive    UserStatus = "active"
	StatusSuspended UserStatus = "suspended"
	StatusInvited   UserStatus = "invited"
)

type CommandUser struct {
	ID          string           `json:"id"`
	Email       string           `json:"email"`
	Name        string           `json:"name"`
	Role        account.UserRole `json:"role"`
	Status      UserStatus       `json:"status"`
	Permissions []string         `json:"permissions"`
	LastActive  *time.Time       `json:"lastActive,omitempty"`
	CreatedAt   time.Time        `json:"createdAt"`
}

type UserInvite struct {
	Email     string           `json:"email"`
	Name      string           `json:"name"`
	Role      account.UserRole `json:"role"`
	Token     string           `json:"token"`
	ExpiresAt time.Time        `json:"expiresAt"`
}
