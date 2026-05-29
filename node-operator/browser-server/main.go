package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	port := "3035"
	publicDir := "./public"

	// Serve static files with proper MIME types
	fs := http.FileServer(http.Dir(publicDir))
	http.Handle("/", applyHeaders(fs))

	log.Printf("Wnode Browser Node Server listening on http://localhost:%s\n", port)
	log.Printf("Serving files from: %s\n", publicDir)

	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// applyHeaders ensures the correct MIME type for WebAssembly
func applyHeaders(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if filepath.Ext(r.URL.Path) == ".wasm" {
			w.Header().Set("Content-Type", "application/wasm")
		}
		h.ServeHTTP(w, r)
	})
}
