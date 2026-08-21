#!/bin/bash
awk '/func \(s \*Store\) SaveState/,/^}/' nodld/internal/account/store.go
