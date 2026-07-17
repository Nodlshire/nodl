package sharding

import (
	"crypto/sha256"
	"encoding/binary"
	"fmt"
)

// Deterministic shard mapping
const NumShards = 32

func GetShardForNode(upid string) int {
	h := sha256.New()
	h.Write([]byte(upid))
	hashBytes := h.Sum(nil)
	
	val := binary.BigEndian.Uint64(hashBytes[:8])
	return int(val % NumShards)
}

func GetTopicForShard(region string, shardID int) string {
	if region == "" {
		region = "global"
	}
	return fmt.Sprintf("wnode/telemetry/%s/shard/%d", region, shardID)
}
