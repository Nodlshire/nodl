/**
 * apps/command/app/lib/mesh-intel.ts
 * Phase 19: Mesh Intelligence Layer (Explainable, Rule-Based, Read-Only)
 */

import { MeshNode, MeshTask, MeshMetrics } from './mesh-client';

export interface MeshHealthReport {
    status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    message: string;
    details: string[];
}

export interface BottleneckInfo {
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    title: string;
    description: string;
}

export interface NodeAnomaly {
    nodeId: string;
    type: 'HIGH_LOAD' | 'UNRESPONSIVE' | 'FREQUENT_FLAP';
    details: string;
}

export interface TaskInsight {
    patternId: string;
    title: string;
    count: number;
    explanation: string;
}

/**
 * Evaluates overall cluster stability using rule-based heuristics.
 */
export function analyzeMeshHealth(metrics: MeshMetrics, nodes: MeshNode[] = [], tasks: MeshTask[] = []): MeshHealthReport {
    const safeNodes = nodes || [];
    const safeTasks = tasks || [];
    const details: string[] = [];
    let status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' = 'HEALTHY';

    const offlinePercentage = metrics.totalNodes > 0 ? (metrics.offlineNodes / metrics.totalNodes) * 100 : 0;
    const failureRate = (metrics.completedTasks + metrics.failedTasks) > 0 
        ? (metrics.failedTasks / (metrics.completedTasks + metrics.failedTasks)) * 100 
        : 0;

    if (offlinePercentage > 30) {
        status = 'CRITICAL';
        details.push(`High node mortality: ${offlinePercentage.toFixed(1)}% of nodes are offline.`);
    } else if (offlinePercentage > 10) {
        status = 'DEGRADED';
        details.push(`Minor node mortality: ${offlinePercentage.toFixed(1)}% of nodes are offline.`);
    }

    if (failureRate > 20) {
        status = 'CRITICAL';
        details.push(`Critical failure rate: ${failureRate.toFixed(1)}% of tasks are failing.`);
    } else if (failureRate > 5) {
        if (status !== 'CRITICAL') status = 'DEGRADED';
        details.push(`Elevated failure rate: ${failureRate.toFixed(1)}% of tasks are failing.`);
    }

    if (metrics.avgLatencyMs > 5000) {
        if (status !== 'CRITICAL') status = 'DEGRADED';
        details.push(`High average latency detected: ${metrics.avgLatencyMs}ms.`);
    }

    const message = status === 'HEALTHY' 
        ? "Mesh is operating within normal parameters." 
        : `Mesh health is ${status.toLowerCase()} with ${details.length} issues detected.`;

    return { status, message, details };
}

/**
 * Identifies resource constraints and queue congestion.
 */
export function detectBottlenecks(metrics: MeshMetrics, nodes: MeshNode[] = []): BottleneckInfo[] {
    const safeNodes = nodes || [];
    const bottlenecks: BottleneckInfo[] = [];

    // Rule: Queue buildup with idle capacity
    if (metrics.queuedTasks > 20 && metrics.onlineNodes > metrics.runningTasks) {
        bottlenecks.push({
            severity: 'MEDIUM',
            title: 'Scheduling Congestion',
            description: `There are ${metrics.queuedTasks} tasks waiting while ${metrics.onlineNodes - metrics.runningTasks} nodes appear to be idle. This suggests a bottleneck in the task dispatcher.`
        });
    }

    // Rule: Sustained high latency
    if (metrics.avgLatencyMs > 10000) {
        bottlenecks.push({
            severity: 'HIGH',
            title: 'Critical Execution Delay',
            description: `Average task latency is extremely high (${metrics.avgLatencyMs}ms). This typically indicates resource exhaustion on active nodes or bandwidth throttling.`
        });
    }

    // Rule: Low online node ratio
    if (metrics.totalNodes > 0 && metrics.onlineNodes / metrics.totalNodes < 0.5) {
        bottlenecks.push({
            severity: 'HIGH',
            title: 'Insufficient Mesh Capacity',
            description: `Less than 50% of the mesh is currently online. This severely limits total system throughput.`
        });
    }

    return bottlenecks;
}

/**
 * Flags nodes with high load or missing heartbeats.
 */
export function detectNodeAnomalies(nodes: MeshNode[] = []): NodeAnomaly[] {
    const safeNodes = nodes || [];
    const anomalies: NodeAnomaly[] = [];
    const now = Date.now();

    safeNodes.forEach(node => {
        if (node.status === 'online') {
            // Rule: High CPU/Resource load
            if (node.load > 0.9) {
                anomalies.push({
                    nodeId: node.nodeId,
                    type: 'HIGH_LOAD',
                    details: `Node is operating at ${(node.load * 100).toFixed(1)}% load, which may cause task timeouts.`
                });
            }

            // Rule: Stale heartbeat
            const heartbeatAge = now - node.lastHeartbeat;
            if (heartbeatAge > 30000) { // 30 seconds
                anomalies.push({
                    nodeId: node.nodeId,
                    type: 'UNRESPONSIVE',
                    details: `Node is marked online but heartbeat is ${Math.round(heartbeatAge / 1000)}s old.`
                });
            }
        }
    });

    return anomalies;
}

/**
 * Analyzes failure patterns in tasks.
 */
export function explainTaskFailures(tasks: MeshTask[] = []): TaskInsight[] {
    const safeTasks = (tasks || []).filter(t => t.status === 'failed');
    if (safeTasks.length === 0) return [];

    const insights: TaskInsight[] = [];
    
    // Group by nodeId to find problematic providers
    const failuresPerNode: Record<string, number> = {};
    safeTasks.forEach(task => {
        if (task.nodeId) {
            failuresPerNode[task.nodeId] = (failuresPerNode[task.nodeId] || 0) + 1;
        }
    });

    const problematicNodes = Object.entries(failuresPerNode)
        .filter(([_, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1]);

    if (problematicNodes.length > 0) {
        insights.push({
            patternId: 'unreliable_nodes',
            title: 'Unreliable Provider Nodes',
            count: problematicNodes.length,
            explanation: `Detected ${problematicNodes.length} nodes with recurring task failures. Node ${problematicNodes[0][0]} has failed ${problematicNodes[0][1]} tasks recently.`
        });
    }

    // Check for "Cascading Failure" pattern
    const recentFailures = safeTasks.filter(t => (Date.now() - t.updatedAt) < 300000); // last 5 mins
    if (recentFailures.length > 10) {
        insights.push({
            patternId: 'cascading_failure',
            title: 'Potential Cascading Failure',
            count: recentFailures.length,
            explanation: `High burst of failures (${recentFailures.length}) in the last 5 minutes across multiple nodes. This often points to a global coordinator or network issue.`
        });
    }

    return insights;
}

/**
 * Aggregates all insights into a natural-language diagnostics report.
 */
export function generateDiagnosticsReport(
    health: MeshHealthReport, 
    bottlenecks: BottleneckInfo[], 
    anomalies: NodeAnomaly[], 
    insights: TaskInsight[]
): string {
    let report = "OPERATOR DIAGNOSTIC REPORT\n";
    report += "==========================\n\n";

    report += `Current Status: ${health.status}\n`;
    report += `Summary: ${health.message}\n\n`;

    if (bottlenecks.length > 0) {
        report += "PRIMARY BOTTLENECKS:\n";
        bottlenecks.forEach(b => report += `- [${b.severity}] ${b.title}: ${b.description}\n`);
        report += "\n";
    }

    if (anomalies.length > 0) {
        report += `NODE ANOMALIES (${anomalies.length} total):\n`;
        anomalies.slice(0, 3).forEach(a => report += `- ${a.nodeId}: ${a.type} - ${a.details}\n`);
        if (anomalies.length > 3) report += `- ... and ${anomalies.length - 3} more.\n`;
        report += "\n";
    }

    if (insights.length > 0) {
        report += "CRITICAL PATTERNS:\n";
        insights.forEach(i => report += `- ${i.title}: ${i.explanation}\n`);
    } else if (health.status === 'HEALTHY') {
        report += "All subsystems are running smoothly. No critical patterns identified.";
    }

    return report;
}
