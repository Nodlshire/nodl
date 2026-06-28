package mesh

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

type FileSystemPersistenceAdapter struct {
	dataDir string
}

func NewFileSystemPersistenceAdapter(dataDir string) *FileSystemPersistenceAdapter {
	os.MkdirAll(dataDir, 0755)
	return &FileSystemPersistenceAdapter{dataDir: dataDir}
}

func (a *FileSystemPersistenceAdapter) WriteSnapshot(name string, snapshot MeshSnapshot) error {
	path := filepath.Join(a.dataDir, name+".json")
	b, _ := json.MarshalIndent(snapshot, "", "  ")
	return ioutil.WriteFile(path, b, 0644)
}

func (a *FileSystemPersistenceAdapter) ReadSnapshot(name string) (*MeshSnapshot, error) {
	path := filepath.Join(a.dataDir, name+".json")
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var s MeshSnapshot
	json.Unmarshal(b, &s)
	return &s, nil
}

func (a *FileSystemPersistenceAdapter) AppendEvent(logName string, event MeshEvent) error {
	path := filepath.Join(a.dataDir, logName+".jsonl")
	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	b, _ := json.Marshal(event)
	f.Write(append(b, '\n'))
	return nil
}

func (a *FileSystemPersistenceAdapter) ReadEvents(logName string) ([]MeshEvent, error) {
	path := filepath.Join(a.dataDir, logName+".jsonl")
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	lines := strings.Split(string(b), "\n")
	var events []MeshEvent
	for _, l := range lines {
		if strings.TrimSpace(l) == "" {
			continue
		}
		var e MeshEvent
		json.Unmarshal([]byte(l), &e)
		events = append(events, e)
	}
	return events, nil
}
