/**
 * apps/command/app/lib/mesh-events.ts
 * Phase 20: Mesh Event Timeline & Lifecycle History (Read-Only)
 */

import { MeshNode, MeshTask, MeshMetrics } from './mesh-client';

export type MeshEventType = 
    | 'NODE_HEARTBEAT'
    | 'NODE_OVERLOADED'
    | 'NODE_RECOVERED'
    | 'TASK_CREATED'
    | 'TASK_ASSIGNED'
    | 'TASK_STARTED'
    | 'TASK_COMPLETED'
    | 'TASK_FAILED'
    | 'TASK_RETRIED'
    | 'MESH_BOTTLENECK'
    | 'MESH_HEALTH_CHANGE';

export interface MeshEvent {
    id: string;
    type: MeshEventType;
    timestamp: number;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
    summary: string;
    details: string;
    nodeId?: string;
    taskId?: string;
}

/**
 * Extracts and classifies events for a global mesh timeline.
 */
export function extractMeshEvents(nodes: MeshNode[], tasks: MeshTask[]): MeshEvent[] {
    const events: MeshEvent[] = [];

    // Node-based events
    nodes.forEach(node => {
        events.push(...extractNodeEvents(node));
    });

    // Task-based events
    tasks.forEach(task => {
        events.push(...extractTaskEvents(task));
    });

    // Sort chronologically (newest first)
    return events.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Extracts events for a specific node.
 */
export function extractNodeEvents(node: MeshNode): MeshEvent[] {
    const events: MeshEvent[] = [];
    const nodeId = node.nodeId;

    // Heartbeat (Simulated recent heartbeat event)
    events.push({
        id: `hb-${nodeId}-${node.lastHeartbeat}`,
        type: 'NODE_HEARTBEAT',
        timestamp: node.lastHeartbeat,
        severity: 'INFO',
        summary: `Heartbeat received from node ${nodeId.substring(0, 8)}`,
        details: `Node is currently ${node.status} with a load of ${(node.load * 100).toFixed(1)}%.`,
        nodeId
    });

    // Load-based events
    if (node.load > 0.9) {
        events.push({
            id: `overload-${nodeId}-${node.lastHeartbeat}`,
            type: 'NODE_OVERLOADED',
            timestamp: node.lastHeartbeat - 1000, // Slightly before HB
            severity: 'WARNING',
            summary: `Node ${nodeId.substring(0, 8)} is overloaded`,
            details: `Resource usage exceeded 90% threshold. Currently at ${(node.load * 100).toFixed(1)}%.`,
            nodeId
        });
    }

    return events;
}

/**
 * Extracts events for a specific task lifecycle.
 */
export function extractTaskEvents(task: MeshTask): MeshEvent[] {
    const events: MeshEvent[] = [];
    const taskId = task.taskId;

    // 1. Task Creation
    events.push({
        id: `created-${taskId}`,
        type: 'TASK_CREATED',
        timestamp: task.createdAt,
        severity: 'INFO',
        summary: `Task ${taskId.substring(0, 8)} created`,
        details: `Task queued for mesh processing.`,
        taskId
    });

    // 2. Task Assignment / Start (Synthesis)
    if (task.status !== 'queued') {
        // We assume assignment happened shortly after creation if it's already running/done
        const startTime = task.status === 'running' ? task.updatedAt : (task.createdAt + 500);
        
        events.push({
            id: `assigned-${taskId}`,
            type: 'TASK_ASSIGNED',
            timestamp: startTime,
            severity: 'INFO',
            summary: `Task ${taskId.substring(0, 8)} assigned to node`,
            details: `Task assigned to node ${task.nodeId?.substring(0, 8) || 'unknown'}.`,
            taskId,
            nodeId: task.nodeId || undefined
        });

        if (task.status === 'running') {
            events.push({
                id: `started-${taskId}`,
                type: 'TASK_STARTED',
                timestamp: task.updatedAt,
                severity: 'SUCCESS',
                summary: `Task ${taskId.substring(0, 8)} started execution`,
                details: `Node ${task.nodeId?.substring(0, 8)} began processing task.`,
                taskId,
                nodeId: task.nodeId || undefined
            });
        }
    }

    // 3. Task Completion / Failure
    if (task.status === 'completed') {
        events.push({
            id: `completed-${taskId}`,
            type: 'TASK_COMPLETED',
            timestamp: task.updatedAt,
            severity: 'SUCCESS',
            summary: `Task ${taskId.substring(0, 8)} completed`,
            details: `Execution successful. Result: ${JSON.stringify(task.result || 'No data')}`,
            taskId,
            nodeId: task.nodeId || undefined
        });
    } else if (task.status === 'failed') {
        events.push({
            id: `failed-${taskId}`,
            type: 'TASK_FAILED',
            timestamp: task.updatedAt,
            severity: 'ERROR',
            summary: `Task ${taskId.substring(0, 8)} failed`,
            details: `Execution error encountered.`,
            taskId,
            nodeId: task.nodeId || undefined
        });
    }

    return events;
}

/**
 * Groups events by day for UI display.
 */
export function groupEventsByDay(events: MeshEvent[]): Record<string, MeshEvent[]> {
    const groups: Record<string, MeshEvent[]> = {};

    events.forEach(event => {
        const date = new Date(event.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(event);
    });

    return groups;
}
