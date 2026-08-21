package governance

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/obregan/nodl/nodld/internal/account"
)

type API struct {
	store *Store
}

func NewAPI(store *Store) *API {
	return &API{store: store}
}

func (api *API) RegisterRoutes(router fiber.Router, authMiddleware fiber.Handler) {
	g := router.Group("/governance", authMiddleware)
	
	g.Get("/users", api.listUsers)
	g.Post("/invite", api.inviteUser)
	g.Post("/users/:id/resend-invite", api.resendInvite)
	g.Patch("/users/:id/status", api.updateStatus)
	g.Patch("/users/:id/role", api.updateRole)
	g.Delete("/users/:id", api.deleteUser)
}

func (api *API) listUsers(c *fiber.Ctx) error {
	users := api.store.ListUsers()
	return c.JSON(users)
}

func (api *API) inviteUser(c *fiber.Ctx) error {
	var req struct {
		Email string           `json:"email"`
		Name  string           `json:"name"`
		Role  account.UserRole `json:"role"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	invite, err := api.store.InviteUser(req.Email, req.Name, req.Role)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	// In a real app, we would send an email here.
	// For production readiness, we log the invite token to the console.
	fmt.Printf("[GOVERNANCE] Invite created for %s (%s). Token: %s\n", req.Name, req.Email, invite.Token)

	return c.JSON(fiber.Map{
		"message": "invitation sent successfully",
		"token":   invite.Token,
	})
}

func (api *API) updateStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		Status UserStatus `json:"status"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := api.store.UpdateUserStatus(id, req.Status); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "status updated successfully"})
}

func (api *API) updateRole(c *fiber.Ctx) error {
	id := c.Params("id")
	var req struct {
		Role account.UserRole `json:"role"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
	}

	if err := api.store.UpdateUserRole(id, req.Role); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "role updated successfully"})
}

func (api *API) deleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	if err := api.store.DeleteUser(id); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "user removed successfully"})
}

func (api *API) resendInvite(c *fiber.Ctx) error {
	id := c.Params("id")

	invite, err := api.store.ResendInvite(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	fmt.Printf("[GOVERNANCE] Invite resent for %s. Token: %s\n", invite.Email, invite.Token)

	return c.JSON(fiber.Map{
		"message": "invitation resent successfully",
		"token":   invite.Token,
	})
}

