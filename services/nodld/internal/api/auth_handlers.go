package api

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/pquerna/otp/totp"
	"go.uber.org/zap"
)

// handleGoogleAuth processes a Google Sign-In id_token
func (s *Server) handleGoogleAuth(c *fiber.Ctx) error {
	var req struct {
		IDToken string `json:"id_token"`
		Domain  string `json:"domain"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Domain == "" {
		req.Domain = "mesh"
	}
	if req.Domain == "command" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "google sign-in not supported for command"})
	}

	// Validate token with Google's tokeninfo endpoint
	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.IDToken)
	if err != nil || resp.StatusCode != 200 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid google token"})
	}
	defer resp.Body.Close()

	var tokenInfo struct {
		Email         string `json:"email"`
		EmailVerified string `json:"email_verified"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "failed to decode token info"})
	}

	if tokenInfo.EmailVerified != "true" || tokenInfo.Email == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "email not verified by google"})
	}

	email := strings.ToLower(strings.TrimSpace(tokenInfo.Email))
	nodlr, ok := s.accountStore.GetNodlrByEmail(email)

	// If no WUID exists, create an account
	if !ok {
		// Mock a fast creation
		s.log.Info("[AUTH] Auto-creating account for Google Sign-In", zap.String("email", email))
		
		newAcc, err := s.accountStore.CreateNodlr(email, "", "", email, "", "", "", "", "", "", "")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to create account"})
		}
		nodlr = newAcc
	}

	// Create Session
	sessionID := s.accountStore.CreateSession(nodlr.ID, req.Domain, nodlr.Role)

	cookieName := req.Domain + "_session"
	secureFlag := true
	domainFlag := ".wnode.one"
	sameSiteFlag := "None"

	if os.Getenv("DEVELOPMENT_MODE") == "true" {
		secureFlag = false
		domainFlag = ""
		sameSiteFlag = "Lax"
	}

	c.Cookie(&fiber.Cookie{
		Name:     cookieName,
		Value:    sessionID,
		Expires:  time.Now().Add(24 * time.Hour * 30),
		HTTPOnly: true,
		Secure:   secureFlag,
		SameSite: sameSiteFlag,
		Domain:   domainFlag,
		Path:     "/",
	})

	return c.JSON(fiber.Map{"status": "success", "session_id": sessionID, "requires_2fa": nodlr.TOTPEnabled})
}

// --- TOTP 2FA Endpoints ---

func (s *Server) handleEnable2FA(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	nodlr, ok := s.accountStore.GetNodlr(userID)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "user not found"})
	}

	if nodlr.TOTPEnabled {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "2fa already enabled"})
	}

	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "Wnode",
		AccountName: nodlr.Email,
	})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to generate totp secret"})
	}

	nodlr.TOTPSecret = key.Secret()
	err = s.accountStore.SaveState()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save state"})
	}

	return c.JSON(fiber.Map{
		"secret": key.Secret(),
		"url":    key.URL(),
	})
}

func (s *Server) handleVerify2FA(c *fiber.Ctx) error {
	var req struct {
		Code   string `json:"code"`
		Domain string `json:"domain"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Domain == "" {
		req.Domain = "mesh" // default fallback
	}

	cookieName := req.Domain + "_session"
	sessionID := c.Cookies(cookieName)
	if sessionID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "missing session cookie"})
	}

	sess, ok := s.accountStore.GetSession(sessionID)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid session"})
	}

	nodlr, ok := s.accountStore.GetNodlr(sess.WUID)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "user not found"})
	}

	// Validate TOTP Code
	valid := totp.Validate(req.Code, nodlr.TOTPSecret)
	if !valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid 2fa code"})
	}

	// If they are verifying to enable it for the first time
	if !nodlr.TOTPEnabled {
		nodlr.TOTPEnabled = true
		s.accountStore.SaveState()
	}

	// Upgrade the session
	sess.TwoFAVerified = true
	s.accountStore.SaveState()

	return c.JSON(fiber.Map{"status": "verified"})
}

func (s *Server) handleDisable2FA(c *fiber.Ctx) error {
	var req struct {
		Code string `json:"code"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	userID := c.Locals("user_id").(string)
	nodlr, ok := s.accountStore.GetNodlr(userID)
	if !ok {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "user not found"})
	}

	valid := totp.Validate(req.Code, nodlr.TOTPSecret)
	if !valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid 2fa code"})
	}

	nodlr.TOTPEnabled = false
	nodlr.TOTPSecret = ""
	s.accountStore.SaveState()

	return c.JSON(fiber.Map{"status": "disabled"})
}
