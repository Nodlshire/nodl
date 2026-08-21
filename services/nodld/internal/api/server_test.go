package api_test

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"github.com/obregan/nodl/nodld/internal/account"
	"github.com/obregan/nodl/nodld/internal/forensics"
	"go.uber.org/zap"
)

func newTestServer(t *testing.T) *api.Server {
	t.Helper()
	os.Setenv("ALLOWED_ORIGINS", "http://localhost:3000")
	log := zap.NewNop()
	fStore := forensics.NewStore("test", "test")
	accStore := account.NewStore(fStore, "")
	store := jobs.NewStore()
	dispatcher := jobs.NewDispatcher(store, nil, accStore, fStore, log)
	return api.New(dispatcher, store, nil, accStore, nil, nil, nil, nil, nil, nil, nil, log, time.Now())
}

func TestHandleHealth(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}
}
