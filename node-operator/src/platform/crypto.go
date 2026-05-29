package platform

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// getSaltPath returns the path to the salt file.
func getSaltPath() (string, error) {
	dir, err := getWnodeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "salt"), nil
}

// loadOrGenerateSalt reads the salt from disk, or generates a new 32-byte salt if missing.
func loadOrGenerateSalt() ([]byte, error) {
	path, err := getSaltPath()
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(path)
	if err == nil {
		if len(data) == 32 {
			return data, nil
		}
		Warn("Salt file corrupted. Generating new salt.")
	}

	salt := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, salt); err != nil {
		return nil, fmt.Errorf("failed to generate salt: %w", err)
	}

	if err := os.WriteFile(path, salt, 0600); err != nil {
		return nil, fmt.Errorf("failed to save salt: %w", err)
	}

	Info("Generated new encryption salt.")
	return salt, nil
}

// deriveKey generates an AES-256 key from the machineUUID and the salt.
func deriveKey(machineUUID string) ([]byte, error) {
	salt, err := loadOrGenerateSalt()
	if err != nil {
		return nil, err
	}

	hash := sha256.New()
	hash.Write([]byte(machineUUID))
	hash.Write(salt)
	return hash.Sum(nil), nil
}

// Encrypt encrypts data using AES-256-GCM.
func Encrypt(plaintext []byte, machineUUID string) ([]byte, error) {
	key, err := deriveKey(machineUUID)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}

	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
	return ciphertext, nil
}

// Decrypt decrypts AES-256-GCM encrypted data.
func Decrypt(ciphertext []byte, machineUUID string) ([]byte, error) {
	key, err := deriveKey(machineUUID)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	if len(ciphertext) < gcm.NonceSize() {
		return nil, errors.New("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:gcm.NonceSize()], ciphertext[gcm.NonceSize():]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, nil
}
