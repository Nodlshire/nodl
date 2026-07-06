import re

with open("/home/obregan/wnode/nodld/internal/api/server.go", "r") as f:
    content = f.read()

# 1. Rename handleDebugSession to handleLogin
content = content.replace("func (s *Server) handleDebugSession(c *fiber.Ctx) error {", "func (s *Server) handleLogin(c *fiber.Ctx) error {")

# 2. Remove DEVELOPMENT_MODE check at the start
dev_mode_block = """	if os.Getenv("DEVELOPMENT_MODE") != "true" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "debug_disabled"})
	}

"""
content = content.replace(dev_mode_block, "")

# 3. Replace the identity routing
old_identity = """	// Explicit developer identity mapping (Deterministic)
	if req.Email != "" {
		normalized := strings.ToLower(strings.TrimSpace(req.Email))
		if normalized == "stephen@wnode.one" || normalized == "stephen@wnode.one" {
			req.WUID = "100001-0426-01-AA"
		} else if normalized == "test@user.com" {
			req.WUID = "100002-0426-01-AA"
		} else {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized developer identity"})
		}
	}

	acc, ok := s.accountStore.GetNodlr(req.WUID)"""

new_identity = """	var acc *account.Nodlr
	var ok bool
	
	if req.Email != "" {
		normalized := strings.ToLower(strings.TrimSpace(req.Email))
		acc, ok = s.accountStore.GetNodlrByEmail(normalized)
	} else if req.WUID != "" {
		acc, ok = s.accountStore.GetNodlr(req.WUID)
	}
"""
content = content.replace(old_identity, new_identity)

# 4. Route registration
content = content.replace('apiV1.Post("/auth/login", s.handleHealth)', 'apiV1.Post("/auth/login", s.handleLogin)')
content = content.replace('apiV1.Post("/auth/debug-session", s.handleDebugSession)\n', '')

# 5. Logout MaxAge
logout_block_old = """		// Clear the cookie on the client
		c.Cookie(&fiber.Cookie{
			Name:     cookieName,
			Value:    "",
			Expires:  time.Now().Add(-24 * time.Hour),
			HTTPOnly: true,
			Secure:   secureFlag,
			SameSite: "None",
		})"""
logout_block_new = """		// Clear the cookie on the client
		c.Cookie(&fiber.Cookie{
			Name:     cookieName,
			Value:    "",
			Expires:  time.Now().Add(-24 * time.Hour),
			MaxAge:   -1,
			HTTPOnly: true,
			Secure:   secureFlag,
			SameSite: "None",
		})"""
content = content.replace(logout_block_old, logout_block_new)

with open("/home/obregan/wnode/nodld/internal/api/server.go", "w") as f:
    f.write(content)

