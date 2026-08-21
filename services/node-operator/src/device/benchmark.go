package device

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"math"
	"math/rand"
	"runtime"
	"sync"
	"time"

	"github.com/obregan/nodl/node-operator/src/platform"
)

var (
	benchmarkMu   sync.Mutex
	lastRun       time.Time
	cachedCompute float64
	cachedCPU     float64
	cachedGPU     float64
	cachedMem     float64
)

func RunBenchmarks(gpu *GPUInfo) (cpu, gpuScore, mem, compute float64) {
	benchmarkMu.Lock()
	defer benchmarkMu.Unlock()

	// Run at startup and every 24 hours
	if !lastRun.IsZero() && time.Since(lastRun) < 24*time.Hour {
		return cachedCPU, cachedGPU, cachedMem, cachedCompute
	}

	platform.Info("Running daily compute micro-benchmarks...")

	cachedCPU = benchCPU()
	cachedMem = benchMemory()
	if gpu != nil && gpu.VramMB > 0 {
		cachedGPU = benchGPU(gpu.VramMB)
	} else {
		cachedGPU = 0
	}

	// Calculate weighted composite score
	cachedCompute = (cachedCPU * 0.4) + (cachedGPU * 0.5) + (cachedMem * 0.1)
	
	// Normalize to 0-100 max boundary
	if cachedCompute > 100 {
		cachedCompute = 100
	}

	lastRun = time.Now()
	platform.Info("Benchmarks complete: Compute=%.2f | CPU=%.2f | GPU=%.2f | Mem=%.2f", cachedCompute, cachedCPU, cachedGPU, cachedMem)

	return cachedCPU, cachedGPU, cachedMem, cachedCompute
}

func benchCPU() float64 {
	start := time.Now()

	// 1000 SHA-256
	data := make([]byte, 1024)
	for i := 0; i < 1000; i++ {
		_ = sha256.Sum256(data)
	}

	// 1000 AES
	key := make([]byte, 32)
	block, _ := aes.NewCipher(key)
	gcm, _ := cipher.NewGCM(block)
	nonce := make([]byte, gcm.NonceSize())
	for i := 0; i < 1000; i++ {
		_ = gcm.Seal(nil, nonce, data, nil)
	}

	// 1000 float ops
	var f float64 = 1.0
	for i := 0; i < 1000; i++ {
		f = math.Sin(f) * math.Cos(f)
	}

	duration := time.Since(start).Seconds()
	
	// Normalize mapping: faster is better. Baseline expected ~0.05s on decent CPU.
	score := (0.1 / duration) * 50.0 
	if score > 100 {
		score = 100
	}
	return score
}

func benchMemory() float64 {
	start := time.Now()
	
	// Memcpy bandwidth simulation
	size := 10 * 1024 * 1024 // 10MB
	src := make([]byte, size)
	dst := make([]byte, size)
	for i := 0; i < len(src); i++ {
		src[i] = byte(i)
	}
	copy(dst, src)

	duration := time.Since(start).Seconds()

	// Normalize mapping. Expected ~0.005s
	score := (0.01 / duration) * 50.0
	if score > 100 {
		score = 100
	}
	return score
}

// benchGPU mocks a native CUDA kernel by running heavily parallel math scaled by VRAM
func benchGPU(vramMB int) float64 {
	start := time.Now()

	// Simulate vector math concurrency
	var wg sync.WaitGroup
	workers := runtime.NumCPU() * 2 // Force high context switching

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			var vec float64
			for j := 0; j < 10000; j++ {
				vec += float64(j) * rand.Float64()
			}
		}()
	}
	wg.Wait()

	duration := time.Since(start).Seconds()

	// Baseline expectation + VRAM scaling bonus
	baseScore := (0.05 / duration) * 30.0
	vramBonus := float64(vramMB) / 1024.0 * 5.0 // 5 points per GB of VRAM

	score := baseScore + vramBonus
	if score > 100 {
		score = 100
	}
	return score
}
