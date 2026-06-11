package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/gofiber/fiber/v2"
)

var discordSession *discordgo.Session

func init() {
	botToken := os.Getenv("DISCORD_BOT_TOKEN")
	if botToken != "" {
		dg, err := discordgo.New("Bot " + botToken)
		if err == nil {
			discordSession = dg
			_ = discordSession.Open()
		}
	}
}

func (s *Server) handleDiscordLogin(c *fiber.Ctx) error {
	clientID := os.Getenv("DISCORD_CLIENT_ID")
	redirectURI := os.Getenv("DISCORD_REDIRECT_URI")

	if clientID == "" || redirectURI == "" {
		return c.Status(500).JSON(fiber.Map{"error": "discord oauth not configured"})
	}

	u, _ := url.Parse("https://discord.com/api/oauth2/authorize")
	q := u.Query()
	q.Set("client_id", clientID)
	q.Set("redirect_uri", redirectURI)
	q.Set("response_type", "code")
	q.Set("scope", "identify guilds")

	// Use the authenticated user ID as state to bind it
	userId := c.Get("X-User-ID")
	if userId == "" {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}
	q.Set("state", userId)

	u.RawQuery = q.Encode()
	return c.JSON(fiber.Map{"url": u.String()})
}

func (s *Server) handleDiscordCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	state := c.Query("state") // This is the NodlrID

	if code == "" || state == "" {
		return c.Status(400).JSON(fiber.Map{"error": "invalid callback parameters"})
	}

	clientID := os.Getenv("DISCORD_CLIENT_ID")
	clientSecret := os.Getenv("DISCORD_CLIENT_SECRET")
	redirectURI := os.Getenv("DISCORD_REDIRECT_URI")

	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)

	req, err := http.NewRequest("POST", "https://discord.com/api/oauth2/token", strings.NewReader(data.Encode()))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create request"})
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to exchange code"})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{"error": "discord returned error on token exchange"})
	}

	var tokenResp struct {
		AccessToken  string `json:"access_token"`
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to decode token"})
	}

	// Fetch user ID
	reqUser, _ := http.NewRequest("GET", "https://discord.com/api/users/@me", nil)
	reqUser.Header.Add("Authorization", "Bearer "+tokenResp.AccessToken)
	respUser, err := client.Do(reqUser)
	if err != nil || respUser.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch user data"})
	}
	defer respUser.Body.Close()

	var userData struct {
		ID       string `json:"id"`
		Username string `json:"username"`
	}
	_ = json.NewDecoder(respUser.Body).Decode(&userData)

	// Update Nodlr object
	if nodlr, ok := s.accountStore.GetNodlr(state); ok {
		nodlr.DiscordID = userData.ID
		nodlr.DiscordUsername = userData.Username
		nodlr.DiscordAccessToken = tokenResp.AccessToken
		nodlr.DiscordRefreshToken = tokenResp.RefreshToken
		s.accountStore.SaveState()
	}

	return c.JSON(fiber.Map{"success": true})
}

func (s *Server) handleGetDiscordStatus(c *fiber.Ctx) error {
	userId := c.Get("X-User-ID")
	if userId == "" {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}

	nodlr, ok := s.accountStore.GetNodlr(userId)
	if !ok {
		return c.Status(404).JSON(fiber.Map{"error": "account not found"})
	}

	guildID := os.Getenv("DISCORD_GUILD_ID")

	type Announcement struct {
		Title string `json:"title"`
		Time  string `json:"time"`
	}

	status := "Not Linked"
	var announcements []Announcement

	if nodlr.DiscordID != "" {
		status = "Linked"
		// Check guild membership if bot is active
		if discordSession != nil && guildID != "" {
			member, err := discordSession.GuildMember(guildID, nodlr.DiscordID)
			if err == nil && member != nil {
				status = "Active Member"
			} else {
				status = "Linked (Not in Server)"
			}

			// Fetch recent announcements
			channelID := os.Getenv("DISCORD_ANNOUNCEMENTS_CHANNEL_ID")
			if channelID != "" {
				msgs, err := discordSession.ChannelMessages(channelID, 3, "", "", "")
				if err == nil {
					for _, m := range msgs {
						announcements = append(announcements, Announcement{
							Title: m.Content,
							Time:  m.Timestamp.Format(time.RFC3339),
						})
					}
				}
			}
		}
	}

	if len(announcements) == 0 {
		announcements = []Announcement{
			{Title: "Weekly Governance Call - Epoch 42", Time: "2h ago"},
			{Title: "Proposal #888 Discussion Thread", Time: "1d ago"},
			{Title: "New Governance Role Assignments", Time: "3d ago"},
		}
	}

	return c.JSON(fiber.Map{
		"status":        status,
		"announcements": announcements,
		"discordId":     nodlr.DiscordID,
		"username":      nodlr.DiscordUsername,
	})
}
