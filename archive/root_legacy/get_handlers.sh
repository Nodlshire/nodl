#!/bin/bash
awk '/func \(s \*Server\) handleRegisterNode/,/^}/' nodld/internal/api/server.go
echo "---"
awk '/func \(s \*Server\) handleHeartbeatNode/,/^}/' nodld/internal/api/server.go
