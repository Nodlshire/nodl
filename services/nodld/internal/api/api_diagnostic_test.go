package api_test

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/acquisition"
	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func TestAPISurfaceTruthSweep(t *testing.T) {
	t.Log("=== PHASE 2: FULL API SURFACE TRUTH SWEEP ===")

	fStore := forensics.NewStore("secret", "salt")
	accStore := account.NewStore(fStore, "../../state/engine.json")
	log := zap.NewNop()

	acqSvc := acquisition.NewService(accStore, log)
	acqHandler := acquisition.NewHandler(acqSvc, log)

	server := api.New(nil, nil, nil, accStore, nil, nil, nil, nil, acqHandler, nil, nil, log, time.Now())
	app := server.App()

	// Register routes for testing
	// Create real sessions
	stephenSess := accStore.CreateSession("100001-0426-01-AA", "command", account.RoleOwner)
	maltheSess := accStore.CreateSession("100001-0426-02-AB", "nodlr", account.RoleStandard)
	artemSess := accStore.CreateSession("100003-0426-02-AB", "nodlr", account.RoleStandard)

	endpoints := []struct {
		name    string
		method  string
		url     string
		session string
		headers map[string]string
	}{
		{"GET /api/v1/nodlrs (Stephen)", "GET", "/api/v1/nodlrs", stephenSess, nil},
		{"GET /api/v1/nodes (Stephen)", "GET", "/api/v1/nodes", stephenSess, nil},
		{"GET /api/v1/nodes (Malthe)", "GET", "/api/v1/nodes", maltheSess, nil},
		{"GET /api/v1/nodes (Artem)", "GET", "/api/v1/nodes", artemSess, nil},
		{"GET /api/v1/nodes?scope=all (Unauthenticated)", "GET", "/api/v1/nodes?scope=all", "", nil},
		{"GET /api/v1/nodes?scope=all (Stephen Owner)", "GET", "/api/v1/nodes?scope=all", stephenSess, nil},
		{"GET /api/v1/nodes (Forged X-User-ID without cookie)", "GET", "/api/v1/nodes", "", map[string]string{"X-User-ID": "100001-0426-01-AA"}},
		{"GET /api/v1/affiliates (Stephen)", "GET", "/api/v1/affiliates", stephenSess, nil},
		{"GET /api/v1/affiliates/tree (Stephen)", "GET", "/api/v1/affiliates/tree", stephenSess, nil},
		{"GET /api/v1/affiliates/children?parent=100001-0426-01-AA", "GET", "/api/v1/affiliates/children?parent=100001-0426-01-AA", stephenSess, nil},
		{"GET /api/v1/affiliates/children?parent=100001-0426-02-AB", "GET", "/api/v1/affiliates/children?parent=100001-0426-02-AB", stephenSess, nil},
	}

	for _, ep := range endpoints {
		t.Run(ep.name, func(t *testing.T) {
			req := httptest.NewRequest(ep.method, ep.url, nil)
			if ep.session != "" {
				req.AddCookie(&http.Cookie{Name: "cmd_session", Value: ep.session})
				req.AddCookie(&http.Cookie{Name: "nodlr_session", Value: ep.session})
			}
			for k, v := range ep.headers {
				req.Header.Set(k, v)
			}

			resp, err := app.Test(req, -1)
			if err != nil {
				t.Fatalf("HTTP Test Error: %v", err)
			}
			body, _ := io.ReadAll(resp.Body)

			// Formatted log output for Phase 2 report
			buf := new(bytes.Buffer)
			fmt.Fprintf(buf, "\n--- RAW API LOG: %s ---\n", ep.name)
			fmt.Fprintf(buf, "REQUEST: %s %s\n", ep.method, ep.url)
			if ep.session != "" {
				fmt.Fprintf(buf, "COOKIES: session=%s\n", ep.session[:8]+"...")
			}
			for k, v := range ep.headers {
				fmt.Fprintf(buf, "HEADER %s: %s\n", k, v)
			}
			fmt.Fprintf(buf, "HTTP STATUS: %d\n", resp.StatusCode)
			fmt.Fprintf(buf, "RAW RESPONSE JSON:\n%s\n", string(body))
			t.Log(buf.String())
		})
	}
}
