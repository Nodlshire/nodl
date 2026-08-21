/**
 * apps/command/app/lib/mesh-alerts.ts
 * Phase 21: Operator Alerts & Incident Console (Read-Only)
 */

import { MeshNode, MeshTask, MeshMetrics } from './mesh-client';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface MeshAlert {
    id: string;
    type: string;
    severity: AlertSeverity;
    summary: string;
    details: string;
    timestamp: number;
    nodeId?: string;
    taskId?: string;
    suggestion?: string;
}

export interface IncidentSummary {
    id: string;
    title: string;
    severity: AlertSeverity;
    alertCount: number;
    description: string;
    startTime: number;
}

/**
 * Generates alerts related to provider nodes.
 */
export function generateNodeAlerts(nodes: MeshNode[]): MeshAlert[] {
    const alerts: MeshAlert[] = [];
    const now = Date.now();

    nodes.forEach(node => {
        // Rule: Node Unresponsive
        const hbAge = now - node.lastHeartbeat;
        if (node.status === 'online' && hbAge > 120000) { // 2 minutes
            alerts.push({
                id: `alert-node-unresponsive-${node.nodeId}`,
                type: 'NODE_UNRESPONSIVE',
                severity: 'CRITICAL',
                summary: `Node ${node.nodeId.substring(0, 8)} is unresponsive`,
                details: `Status is 'online' but last heartbeat was ${Math.round(hbAge / 1000)}s ago.`,
                timestamp: node.lastHeartbeat,
                nodeId: node.nodeId,
                suggestion: "Check provider network connectivity or restart wnode service."
            });
        }

        // Rule: Node Overloaded
        if (node.status === 'online' && node.load > 0.95) {
            alerts.push({
                id: `alert-node-overload-${node.nodeId}`,
                type: 'NODE_OVERLOADED',
                severity: 'WARNING',
                summary: `Node ${node.nodeId.substring(0, 8)} critical load`,
                details: `Current resource utilization is at ${(node.load * 100).toFixed(1)}%.`,
                timestamp: now,
                nodeId: node.nodeId,
                suggestion: "Consider migrating tasks or checking for resource-intensive processes."
            });
        }
    });

    return alerts;
}

/**
 * Generates alerts related to task execution.
 */
export function generateTaskAlerts(tasks: MeshTask[]): MeshAlert[] {
    const alerts: MeshAlert[] = [];
    const now = Date.now();

    // Rule: Task Failure Spikes
    const failedTasks = tasks.filter(t => t.status === 'failed' && (now - t.updatedAt) < 300000); // last 5 mins
    if (failedTasks.length >= 5) {
        alerts.push({
            id: 'alert-task-failure-spike',
            type: 'TASK_FAILURE_SPIKE',
            severity: 'CRITICAL',
            summary: `Significant task failure spike detected`,
            details: `${failedTasks.length} tasks failed in the last 5 minutes.`,
            timestamp: now,
            suggestion: "Check for global coordinator issues or API changes."
        });
    }

    // Rule: Stuck Tasks
    const stuckTasks = tasks.filter(t => t.status === 'running' && (now - t.updatedAt) > 600000); // running for > 10 mins
    if (stuckTasks.length > 0) {
        alerts.push({
            id: 'alert-tasks-stuck',
            type: 'TASK_STUCK',
            severity: 'WARNING',
            summary: `${stuckTasks.length} tasks appear to be stuck`,
            details: `Tasks have been in 'running' state for over 10 minutes without update.`,
            timestamp: now,
            suggestion: "Verify node connectivity for the assigned tasks."
        });
    }

    return alerts;
}

/**
 * Generates high-level mesh health alerts.
 */
export function generateMeshAlerts(metrics: MeshMetrics): MeshAlert[] {
    const alerts: MeshAlert[] = [];
    const now = Date.now();

    // Rule: Mesh Throughput Drop
    if (metrics.onlineNodes > 0 && metrics.throughputPerMin === 0) {
        alerts.push({
            id: 'alert-mesh-stalled',
            type: 'MESH_DEGRADED',
            severity: 'CRITICAL',
            summary: "Mesh throughput has stalled",
            details: "No tasks are being completed despite online nodes being available.",
            timestamp: now,
            suggestion: "Inspect the task queue and coordinator logs."
        });
    }

    // Rule: High Latency
    if (metrics.avgLatencyMs > 15000) {
        alerts.push({
            id: 'alert-mesh-latency',
            type: 'MESH_BOTTLENECK',
            severity: 'WARNING',
            summary: "Critical latency detected",
            details: `Average execution latency is currently ${metrics.avgLatencyMs}ms.`,
            timestamp: now,
            suggestion: "Scale mesh capacity or check for network congestion."
        });
    }

    return alerts;
}

/**
 * Groups alerts into synthesized incident summaries.
 */
export function summarizeIncidents(allAlerts: MeshAlert[]): IncidentSummary[] {
    const incidents: IncidentSummary[] = [];

    const criticalNodeAlerts = allAlerts.filter(a => a.severity === 'CRITICAL' && a.nodeId);
    if (criticalNodeAlerts.length >= 3) {
        incidents.push({
            id: 'incident-provider-outage',
            title: 'Potential Provider Network Outage',
            severity: 'CRITICAL',
            alertCount: criticalNodeAlerts.length,
            description: `Multiple nodes (${criticalNodeAlerts.length}) are concurrently unresponsive. This likely indicates a regional network failure.`,
            startTime: Math.min(...criticalNodeAlerts.map(a => a.timestamp))
        });
    }

    const taskAlerts = allAlerts.filter(a => a.type.startsWith('TASK'));
    if (taskAlerts.some(a => a.severity === 'CRITICAL')) {
        incidents.push({
            id: 'incident-execution-instability',
            title: 'Task Execution Instability',
            severity: 'CRITICAL',
            alertCount: taskAlerts.length,
            description: "A series of critical task failures or stalls has been detected, affecting overall mesh reliability.",
            startTime: Date.now()
        });
    }

    return incidents;
}
