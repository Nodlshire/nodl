package main

import (
	"fmt"
	"os"

	"go.etcd.io/bbolt"
)

func main() {
	dbPath := "/home/obregan/Documents/nodl/state/engine.db"
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		fmt.Printf("engine.db does NOT exist at %s\n", dbPath)
		return
	}

	db, err := bbolt.Open(dbPath, 0666, &bbolt.Options{ReadOnly: true})
	if err != nil {
		fmt.Printf("Error opening engine.db: %v\n", err)
		return
	}
	defer db.Close()

	err = db.View(func(tx *bbolt.Tx) error {
		return tx.ForEach(func(name []byte, b *bbolt.Bucket) error {
			fmt.Printf("BUCKET: %s\n", string(name))
			count := 0
			err := b.ForEach(func(k, v []byte) error {
				count++
				fmt.Printf("  KEY: %s\n  VAL: %s\n", string(k), string(v))
				return nil
			})
			fmt.Printf("TOTAL IN BUCKET %s: %d\n", string(name), count)
			return err
		})
	})
	if err != nil {
		fmt.Printf("Error reading buckets: %v\n", err)
	}
}
