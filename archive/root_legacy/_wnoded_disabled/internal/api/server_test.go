package api_test

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"time"

	"github.com/obregan/nodl/nodld/internal/api"
	"github.com/obregan/nodl/nodld/internal/buffer"
	"github.com/obregan/nodl/nodld/internal/jobs"
	"go.uber.org/zap"
)

func newTestServer(t *testing.T) *api.Server {
	t.Helper()
	log, _ := zap.NewDevelopment()
	store := jobs.NewStore()
	bufMgr := buffer.NewManager(buffer.DefaultConfig(), log)
	dispatcher := jobs.NewDispatcher(store, nil, nil, log)
	return api.New(dispatcher, store, bufMgr, nil, nil, nil, nil, log, time.Now())
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

	var body map[string]any
	json.NewDecoder(resp.Body).Decode(&body)
	if body["status"] != "ok" {
		t.Errorf("want status=ok, got %v", body["status"])
	}
	if _, ok := body["peers"]; !ok {
		t.Error("expected 'peers' field in health response")
	}
}

func TestHandlePeers_Empty(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/peers", nil)
	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}
}

func TestHandleListJobs_Empty(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/jobs", nil)
	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var list []any
	json.Unmarshal(body, &list)
	if len(list) != 0 {
		t.Errorf("expected empty list, got %d items", len(list))
	}
}

func TestHandleSubmitJob_Success(t *testing.T) {
	s := newTestServer(t)

	// Minimal valid job bundle binary
	wasmBytes := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00}
	manifest := `{"budget":1.5,"targetCycles":500}`

	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, _ := w.CreateFormFile("wasm", "task.wasm")
	fw.Write(wasmBytes)
	w.WriteField("manifest", manifest)
	w.Close()

	req := httptest.NewRequest(http.MethodPost, "/api/v1/jobs", body)
	req.Header.Set("Content-Type", w.FormDataContentType())

	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		b, _ := io.ReadAll(resp.Body)
		t.Fatalf("want 201, got %d: %s", resp.StatusCode, string(b))
	}

	var result map[string]any
	json.NewDecoder(resp.Body).Decode(&result)
	if result["id"] == "" {
		t.Error("expected job ID in response")
	}
}

func TestHandleGetJob_NotFound(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/jobs/nonexistent-id", nil)
	resp, err := s.App().Test(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("want 404, got %d", resp.StatusCode)
	}
}

func TestHandleStreamJobPayload(t *testing.T) {
	s := newTestServer(t)

	// 1. Submit a job first
	wasmBytes := []byte{0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00}
	body := &bytes.Buffer{}
	w := multipart.NewWriter(body)
	fw, _ := w.CreateFormFile("wasm", "task.wasm")
	fw.Write(wasmBytes)
	w.Close()

	submitReq := httptest.NewRequest(http.MethodPost, "/api/v1/jobs", body)
	submitReq.Header.Set("Content-Type", w.FormDataContentType())
	submitResp, _ := s.App().Test(submitReq)
	
	var result map[string]any
	json.NewDecoder(submitResp.Body).Decode(&result)
	jobID := result["id"].(string)

	// 2. Stream the payload
	streamReq := httptest.NewRequest(http.MethodGet, "/api/v1/jobs/"+jobID+"/payload", nil)
	streamResp, err := s.App().Test(streamReq)
	if err != nil {
		t.Fatalf("stream request failed: %v", err)
	}
	defer streamResp.Body.Close()

	if streamResp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", streamResp.StatusCode)
	}

	got, _ := io.ReadAll(streamResp.Body)
	if !bytes.Equal(got, wasmBytes) {
		t.Error("streamed payload mismatch")
	}

	// 3. Verify buffer is gone after stream
	statsReq := httptest.NewRequest(http.MethodGet, "/api/v1/buffer/stats", nil)
	statsResp, _ := s.App().Test(statsReq)
	var stats map[string]any
	json.NewDecoder(statsResp.Body).Decode(&stats)
	if stats["entryCount"].(float64) != 0 {
		t.Errorf("expected 0 entries after stream, got %v", stats["entryCount"])
	}
}

func TestHandleBufferStats(t *testing.T) {
	s := newTestServer(t)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/buffer/stats", nil)
	resp, _ := s.App().Test(req)
	
	if resp.StatusCode != http.StatusOK {
		t.Errorf("want 200, got %d", resp.StatusCode)
	}

	var stats map[string]any
	json.NewDecoder(resp.Body).Decode(&stats)
	if _, ok := stats["entryCount"]; !ok {
		t.Error("expected entryCount in stats")
	}
}
