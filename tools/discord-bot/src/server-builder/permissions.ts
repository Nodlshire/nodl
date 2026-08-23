export interface RoleDefinition {
    name: string;
    color: string;
    hoist: boolean;
    permissions: string;
    position: number;
    description: string;
}

export const ROLE_TEMPLATES: RoleDefinition[] = [
    {
        name: 'Founder',
        color: '#F59E0B',
        hoist: true,
        permissions: '8', // Administrator
        position: 10,
        description: 'Protocol Creator & Sovereign Steward (Full Admin)'
    },
    {
        name: 'Core Team',
        color: '#8B5CF6',
        hoist: true,
        permissions: '1071698660864',
        position: 9,
        description: 'Core Engine Developers & Infrastructure Leads'
    },
    {
        name: 'Operator Spotlight',
        color: '#EC4899', // Pink
        hoist: true,
        permissions: '3072',
        position: 8,
        description: 'Weekly Highlighted Community Node Operator'
    },
    {
        name: 'Mesh Pioneer',
        color: '#F59E0B', // Amber
        hoist: true,
        permissions: '3072',
        position: 7,
        description: 'Completed Weekly Mesh Challenges'
    },
    {
        name: 'Operator Pro',
        color: '#10B981', // Emerald
        hoist: true,
        permissions: '3072',
        position: 6,
        description: 'Verified Multi-Node High Uptime Operator'
    },
    {
        name: 'Telemetry Master',
        color: '#06B6D4', // Cyan
        hoist: true,
        permissions: '3072',
        position: 5,
        description: 'Active Telemetry & DeWi Bug Contributor'
    },
    {
        name: 'Node Operator',
        color: '#10B981',
        hoist: true,
        permissions: '3072',
        position: 4,
        description: 'Verified Compute & DeWi Node Providers'
    },
    {
        name: 'Developer',
        color: '#06B6D4',
        hoist: true,
        permissions: '3072',
        position: 3,
        description: 'WASM Engineers & M2M Application Builders'
    },
    {
        name: 'Beta Tester',
        color: '#3B82F6',
        hoist: true,
        permissions: '3072',
        position: 2,
        description: 'Public Beta Release Candidate Testers'
    },
    {
        name: 'Community',
        color: '#94A3B8',
        hoist: false,
        permissions: '3072',
        position: 1,
        description: 'Default Verified Guild Members'
    }
];
