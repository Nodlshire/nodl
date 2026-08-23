export interface ChannelDefinition {
    name: string;
    type: number; // 0 = GuildText, 4 = GuildCategory
    topic: string;
    isReadOnly?: boolean;
    isTelemetry?: boolean;
    isAdmin?: boolean;
    isDocsNav?: boolean;
    isChangelog?: boolean;
}

export interface CategoryDefinition {
    name: string;
    channels: ChannelDefinition[];
}

export const CATEGORY_TEMPLATES: CategoryDefinition[] = [
    {
        name: '📣 Wnode — Announcements',
        channels: [
            { name: 'welcome', type: 0, topic: 'Personalized welcome portal & 60-second interactive beta onboarding.', isReadOnly: true },
            { name: 'announcements', type: 0, topic: 'Authoritative protocol releases and governance announcements.', isReadOnly: true },
            { name: 'status', type: 0, topic: 'Real-time network operational status and health metrics.', isReadOnly: true, isTelemetry: true },
            { name: 'release-notes', type: 0, topic: 'Changelogs and release tags for nodld daemon and SDKs.', isReadOnly: true, isChangelog: true }
        ]
    },
    {
        name: '🌐 Network Telemetry & DeWi',
        channels: [
            { name: 'mesh-live', type: 0, topic: 'Live telemetry feeds, network capacity reports, and peer counts.', isTelemetry: true },
            { name: 'operator-updates', type: 0, topic: 'Targeted announcements for Node Operators regarding Stripe payouts.' },
            { name: 'dewi-updates', type: 0, topic: 'Updates on LoRaWAN, 5G micro-cells, and CBRS gateway protocols.' }
        ]
    },
    {
        name: '👥 Community',
        channels: [
            { name: 'general', type: 0, topic: 'High-level discussion regarding sovereign compute and DePIN.' },
            { name: 'introductions', type: 0, topic: 'Member introductions and hardware configuration sharing.' },
            { name: 'build-nights', type: 0, topic: 'Weekly build & test sessions, live demos, and WASM envelope workshops.' },
            { name: 'contributions', type: 0, topic: 'Share improvements, experiments, and creative contributions that strengthen the Wnode Mesh.' },
            { name: 'help', type: 0, topic: 'Community-driven general support and onboarding assistance.' }
        ]
    },
    {
        name: '🛠 Node Operator',
        channels: [
            { name: 'getting-started', type: 0, topic: '3-step node installation guide and binary links.', isReadOnly: true },
            { name: 'troubleshooting', type: 0, topic: 'Peer-to-peer technical support for daemon errors.' },
            { name: 'operator-guides', type: 0, topic: 'Headless Linux deployment and performance tuning.' }
        ]
    },
    {
        name: '💻 Developer',
        channels: [
            { name: 'api', type: 0, topic: 'REST API v1 endpoints and WebSocket telemetry streams.' },
            { name: 'sdk', type: 0, topic: 'Native Go and WASM SDK integration guidance.' },
            { name: 'jobs-envelope', type: 0, topic: 'Deterministic WASM job envelope specifications.' },
            { name: 'dev-help', type: 0, topic: 'Q&A for building M2M services on Wnode.' }
        ]
    },
    {
        name: '🔐 Security',
        channels: [
            { name: 'security-updates', type: 0, topic: 'Cryptographic bulletins and security advisories.', isReadOnly: true },
            { name: 'responsible-disclosure', type: 0, topic: 'Guidelines for confidential security vulnerability reports.', isReadOnly: true }
        ]
    },
    {
        name: '📚 Documentation Canon',
        channels: [
            { name: 'docs-index', type: 0, topic: 'Master index of canonical documentation (/docs/INDEX.md).', isDocsNav: true, isReadOnly: true },
            { name: 'docs-changelog', type: 0, topic: 'Automated log of revisions to the /docs/** canon.', isDocsNav: true, isChangelog: true, isReadOnly: true }
        ]
    },
    {
        name: '🤖 Bot & System Admin',
        channels: [
            { name: 'bot-commands', type: 0, topic: 'Execute !docs, !search, !operator, !dewi, !mesh, and !status.' },
            { name: 'bot-log', type: 0, topic: 'Internal audit log for bot re-indexing and command execution.', isAdmin: true, isReadOnly: true },
            { name: 'admin-dashboard', type: 0, topic: 'Core Team system monitoring and node fleet telemetry.', isAdmin: true, isReadOnly: true }
        ]
    },
    {
        name: '🗳 Governance',
        channels: [
            { name: 'governance', type: 0, topic: 'Discussions on Soul-DAO 1-Soul-1-Vote proposals.' },
            { name: 'proposals', type: 0, topic: 'Formal governance proposals and community feedback.' }
        ]
    },
    {
        name: '🧪 Beta Testers',
        channels: [
            { name: 'beta-onboarding', type: 0, topic: 'Quick-Start Beta Guide, telemetry activation & node setup.', isReadOnly: true },
            { name: 'beta-feedback', type: 0, topic: 'Feedback for Public Beta release candidates.' },
            { name: 'beta-bugs', type: 0, topic: 'Structured telemetry bug reports and log submissions.' }
        ]
    }
];
