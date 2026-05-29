package device

type GPUInfo struct {
	Vendor string `json:"vendor"`
	Model  string `json:"model"`
	VramMB int    `json:"vramMB"`
}

type ReputationMetrics struct {
	LocalScore         float64 `json:"localScore"`
	UptimeHours        int64   `json:"uptimeHours"`
	SuccessRate        float64 `json:"successRate"`
	AvgShardDurationMs int64   `json:"avgShardDurationMs"`
	TotalWU            int     `json:"totalWU"`
	TotalRewards       float64 `json:"totalRewards"`
}

type NodeHealthMetrics struct {
	CPU         float64            `json:"cpu"`
	RAM         float64            `json:"ram"`
	Disk        float64            `json:"disk"`
	Uptime      int64              `json:"uptime"`
	Temperature float64            `json:"temperature,omitempty"`
	Network     string             `json:"network"`
	GPU         *GPUInfo           `json:"gpu,omitempty"`
	Reputation  *ReputationMetrics `json:"reputation,omitempty"`
	CurrentLoad  int                `json:"currentLoad"`
	ComputeScore float64            `json:"computeScore"`
	CPUScore     float64            `json:"cpuScore"`
	GPUScore     float64            `json:"gpuScore"`
	MemoryScore  float64            `json:"memoryScore"`
}
