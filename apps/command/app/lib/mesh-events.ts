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
    return [];
}

/**
 * Extracts events for a specific task lifecycle.
 */
export function extractTaskEvents(task: MeshTask): MeshEvent[] {
    return [];
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
