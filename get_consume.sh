#!/bin/bash
awk '/func \(s \*Server\) handleConsumeHeadlessToken/,/^}/' nodld/internal/api/server.go
