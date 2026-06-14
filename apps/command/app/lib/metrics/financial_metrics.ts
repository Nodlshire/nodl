const metrics = {
    conversionSuccess: 0,
    conversionFailure: 0,
    bankSettlementSuccess: 0,
    bankSettlementFailure: 0,
    payoutSuccess: 0,
    payoutFailure: 0,
    pipelineCompleted: 0
};

export function incrementMetric(name: keyof typeof metrics) {
    metrics[name]++;
}

export function getMetrics() {
    return metrics;
}

const latency: Record<string, number[]> = {};

export function recordLatency(stage: string, ms: number) {
    latency[stage] = latency[stage] || [];
    latency[stage].push(ms);
}

export function getLatency() {
    return latency;
}

export let lastRun: Date | null = null;
export function setLastRun(date: Date) {
    lastRun = date;
}
