#!/bin/bash
awk '/func main/,/^}/' node-operator/core/cmd/nodl-core/main.go
