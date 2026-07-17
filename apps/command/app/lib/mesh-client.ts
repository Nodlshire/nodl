/**
 * apps/command/app/lib/mesh-client.ts
 * Phase 17: Command Mesh Dashboard (Minimal, Read-Only)
 */

// Use the Command-side proxy for all mesh data
const MESH_API_BASE = '/api/mesh';

export interface MeshNode {
    nodeId: string;
    id: string;
    upid: string;
    status: "active" | "offline" | "online";
    lastHeartbeat: number;
    lastHeartbeatIso: string;
    lastSeen: string;
    load: number;
    capacity?: number;
    trustScore: number;
    tamperCount: number;
    replayCount: number;
    impersonationCount: number;
    geoAnomalyCount: number;
    lat: number;
    lon: number;
}

export interface MeshTask {
    taskId: string;
    status: "queued" | "running" | "completed" | "failed";
    nodeId: string | null;
    createdAt: number;
    updatedAt: number;
    result?: any;
}

export interface MeshMetrics {
    totalNodes: number;
    onlineNodes: number;
    offlineNodes: number;
    queuedTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgLatencyMs: number;
    throughputPerMin: number;
}

/**
 * Generic fetcher that attaches the local JWT for auth.
 */
async function meshFetch(path: string, options: RequestInit = {}) {
    let headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
    
    if (typeof window !== 'undefined') {
        const jwt = localStorage.getItem('nodl_jwt');
        if (jwt) {
            headers['Authorization'] = `Bearer ${jwt}`;
        }
    }

    try {
        const res = await fetch(`${MESH_API_BASE}${path}`, {
            ...options,
            headers,
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`[meshFetch] Backend error: ${res.status} ${res.statusText} at ${path}`);
            if (res.status === 401) throw new Error("Unauthorized: Session expired or invalid");
            throw new Error(`Mesh API error: ${res.statusText}`);
        }
        return res.json();
    } catch (err) {
        console.warn(`[meshFetch] Connection failed for ${path}:`, err);
        throw err; // Re-throw to allow component-level handling
    }
}

/**
 * Fetches the list of nodes from the coordinator.
 */
export async function listNodes(): Promise<MeshNode[]> {
    return meshFetch('/nodes');
}

/**
 * Fetches the list of tasks from the coordinator.
 */
export async function listTasks(): Promise<MeshTask[]> {
    return meshFetch('/tasks');
}

/**
 * Fetches a single task by ID.
 */
export async function getTask(taskId: string): Promise<MeshTask> {
    // Note: If the coordinator doesn't have a root /tasks/:id yet, 
    // we might need to adjust the proxy or just fetch all and filter.
    // For now, let's assume the proxy handles the same path.
    return meshFetch(`/tasks/${taskId}`);
}

/**
 * Fetches cluster metrics.
 */
export async function getMetrics(): Promise<MeshMetrics> {
    return meshFetch('/metrics');
}

/**
 * Fetches a single node by ID.
 */
export async function getNode(nodeId: string): Promise<MeshNode> {
    const nodes: MeshNode[] = await listNodes();
    const node = nodes.find(n => n.nodeId === nodeId);
    if (!node) throw new Error(`Node ${nodeId} not found`);
    return node;
}
