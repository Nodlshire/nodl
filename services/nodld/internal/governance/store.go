package governance

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/obregan/nodl/nodld/internal/account"
)

type Store struct {
	mu      sync.RWMutex
	users   map[string]*CommandUser
	invites map[string]*UserInvite
}

func NewStore() *Store {
	s := &Store{
		users:   make(map[string]*CommandUser),
		invites: make(map[string]*UserInvite),
	}
	s.seedOwner()
	return s
}

func (s *Store) seedOwner() {
	ownerID := "1" // Stephen is User 1
	now := time.Now()
	s.users[ownerID] = &CommandUser{
		ID:          ownerID,
		Email:       "stephen@wnode.one",
		Name:        "Stephen Soos",
		Role:        account.RoleOwner,
		Status:      StatusActive,
		Permissions: []string{"all"},
		CreatedAt:   now,
	}
}

func (s *Store) ListUsers() []*CommandUser {
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]*CommandUser, 0, len(s.users))
	for _, u := range s.users {
		list = append(list, u)
	}
	return list
}

func (s *Store) GetUser(id string) (*CommandUser, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[id]
	return u, ok
}

func (s *Store) GetUserByEmail(email string) (*CommandUser, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, u := range s.users {
		if u.Email == email {
			return u, true
		}
	}
	return nil, false
}

func (s *Store) InviteUser(email, name string, role account.UserRole) (*UserInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if user already exists
	for _, u := range s.users {
		if u.Email == email && u.Status != StatusInvited {
			return nil, fmt.Errorf("user with this email already exists and is active")
		}
	}

	token := uuid.New().String()
	invite := &UserInvite{
		Email:     email,
		Name:      name,
		Role:      role,
		Token:     token,
		ExpiresAt: time.Now().Add(48 * time.Hour),
	}

	s.invites[token] = invite

	// If user already exists as 'invited', don't create new one, just update name/role
	for _, u := range s.users {
		if u.Email == email && u.Status == StatusInvited {
			u.Name = name
			u.Role = role
			return invite, nil
		}
	}

	// Create a placeholder user entry with status 'invited'
	newUser := &CommandUser{
		ID:        uuid.New().String(),
		Email:     email,
		Name:      name,
		Role:      role,
		Status:    StatusInvited,
		CreatedAt: time.Now(),
	}
	s.users[newUser.ID] = newUser

	return invite, nil
}

func (s *Store) ResendInvite(userID string) (*UserInvite, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	u, ok := s.users[userID]
	if !ok {
		return nil, fmt.Errorf("user not found")
	}

	if u.Status != StatusInvited {
		return nil, fmt.Errorf("user is already active or suspended")
	}

	// Clean up old invites for this email
	for t, inv := range s.invites {
		if inv.Email == u.Email {
			delete(s.invites, t)
		}
	}

	token := uuid.New().String()
	invite := &UserInvite{
		Email:     u.Email,
		Name:      u.Name,
		Role:      u.Role,
		Token:     token,
		ExpiresAt: time.Now().Add(48 * time.Hour),
	}

	s.invites[token] = invite
	return invite, nil
}

func (s *Store) UpdateUserStatus(id string, status UserStatus) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	u, ok := s.users[id]
	if !ok {
		return fmt.Errorf("user not found")
	}

	if u.Role == account.RoleOwner && status != StatusActive {
		return fmt.Errorf("sovereign owner cannot be suspended")
	}

	u.Status = status
	return nil
}

func (s *Store) UpdateUserRole(id string, role account.UserRole) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	u, ok := s.users[id]
	if !ok {
		return fmt.Errorf("user not found")
	}

	if u.Role == account.RoleOwner {
		return fmt.Errorf("sovereign owner role cannot be changed")
	}

	u.Role = role
	return nil
}

func (s *Store) DeleteUser(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	u, ok := s.users[id]
	if !ok {
		return fmt.Errorf("user not found")
	}

	if u.Role == account.RoleOwner {
		return fmt.Errorf("sovereign owner cannot be removed")
	}

	delete(s.users, id)
	return nil
}
