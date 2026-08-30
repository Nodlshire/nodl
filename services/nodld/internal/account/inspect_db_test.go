package account_test

import (
	"os"
	"testing"
	"time"

	"go.etcd.io/bbolt"
)

func TestDumpEngineDB(t *testing.T) {
	dbPath := "/tmp/engine_copy.db"
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		t.Logf("engine.db does NOT exist at %s", dbPath)
		return
	}

	db, err := bbolt.Open(dbPath, 0666, &bbolt.Options{ReadOnly: true, Timeout: 1 * time.Second})
	if err != nil {
		t.Logf("Error opening engine.db: %v", err)
		return
	}
	defer db.Close()

	err = db.View(func(tx *bbolt.Tx) error {
		return tx.ForEach(func(name []byte, b *bbolt.Bucket) error {
			t.Logf("BUCKET: %s", string(name))
			count := 0
			err := b.ForEach(func(k, v []byte) error {
				count++
				t.Logf("  KEY: %s | VAL: %s", string(k), string(v))
				return nil
			})
			t.Logf("TOTAL IN BUCKET %s: %d", string(name), count)
			return err
		})
	})
	if err != nil {
		t.Logf("Error reading buckets: %v", err)
	}
}
