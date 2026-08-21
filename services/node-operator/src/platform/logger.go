package platform

import (
	"fmt"
	"os"
	"path/filepath"
	"time"
)

type LogLevel string

const (
	LevelInfo  LogLevel = "INFO"
	LevelWarn  LogLevel = "WARN"
	LevelError LogLevel = "ERROR"
)

func getLogPath() (string, error) {
	dir, err := getWnodeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "operator.log"), nil
}

// Log writes a message to ~/.wnode/operator.log and optionally to stdout.
func Log(level LogLevel, msg string) {
	timestamp := time.Now().UTC().Format(time.RFC3339)
	line := fmt.Sprintf("%s [%s] %s\n", timestamp, level, msg)

	// Always print to stdout
	fmt.Print(line)

	// Append to file
	path, err := getLogPath()
	if err == nil {
		f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err == nil {
			defer f.Close()
			_, _ = f.WriteString(line)
		}
	}
}

// Info logs an informational message.
func Info(format string, args ...any) {
	Log(LevelInfo, fmt.Sprintf(format, args...))
}

// Error logs an error message.
func Error(format string, args ...any) {
	Log(LevelError, fmt.Sprintf(format, args...))
}

// Warn logs a warning message.
func Warn(format string, args ...any) {
	Log(LevelWarn, fmt.Sprintf(format, args...))
}
