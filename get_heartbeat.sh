#!/bin/bash
awk '/func SendHeartbeat/,/^}/' node-operator/src/device/heartbeat.go
