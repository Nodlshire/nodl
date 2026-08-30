/**
 * Canonical Wnode Node Operator Types
 * 
 * 1. Native Node Operator ('native'): Desktop GUI application binary.
 * 2. Headless Node Operator ('headless'): Server CLI/daemon service binary.
 * 3. Space Node Operator ('space'): Dedicated hardware / Minisforum / MS-02 / Orbital operator node.
 */
export type NodeType = 'native' | 'headless' | 'space';

export interface WnodeDevice {
    id: string;
    name: string;
    node_type: NodeType;
    operator_type: 'Native Node Operator' | 'Headless Node Operator' | 'Space Node Operator';
    owner_id: string;
    lat: number;
    lon: number;
    status: 'Active' | 'Offline' | 'Suspended';
    cpu_specs: string;
    gpu_specs: string;
    ram_total: string;
    uptime: string;
    last_seen: string;
    os?: string;
    arch?: string;
    tier?: string | number;
    reputation?: number;
    identity_trust?: number;
    spatial_hex?: string;
}

export function parseNodeType(raw?: string): NodeType {
    if (!raw) return 'native';
    const lower = raw.toLowerCase();
    if (lower.includes('headless')) return 'headless';
    if (lower.includes('space') || lower.includes('minisforum') || lower.includes('ms-02') || lower.includes('orbital')) return 'space';
    return 'native';
}

export function getNodeOperatorLabel(type: NodeType): string {
    switch (type) {
        case 'headless':
            return 'Headless Node Operator';
        case 'space':
            return 'Space Node Operator';
        case 'native':
        default:
            return 'Native Node Operator';
    }
}
