#!/bin/bash
awk '/func \(s \*Store\) ConsumeHeadlessToken/,/^}/' nodld/internal/account/store.go
