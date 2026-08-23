import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

export interface ApiEndpointSpec {
    id: string;
    route: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
    domain: '⚙️ Daemon' | '📡 Telemetry' | '🧩 SDK' | '🔐 Auth';
    sdkFunction: string;
    sdkUrl: string;
    summary: string;
    samplePayload?: string;
    responsePayload?: string;
    version: string;
    hash: string;
}

export interface ApiRegistryRecord {
    version: string;
    author: string;
    commitHash: string;
    sdkLinkMap: { [endpoint: string]: string };
    diffSummary: {
        added: string[];
        modified: string[];
        deprecated: string[];
    };
    timestamp: string;
}

export interface ApiState {
    postedHashes: string[];
    registry: ApiRegistryRecord[];
    pinnedMessageId?: string;
}

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/api-registry.json');
const DEFAULT_DOCS_URL = 'https://wnode.one/docs/02-api';

export class ApiDocsEngine {
    private state: ApiState = { postedHashes: [], registry: [] };
    private rootPath: string;

    constructor(rootPath?: string) {
        this.rootPath = rootPath || path.resolve(__dirname, '../../..');
        this.loadState();
    }

    private loadState(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    this.state.registry = parsed;
                    this.state.postedHashes = parsed.map(p => p.version);
                } else {
                    this.state = parsed;
                }
            }
        } catch (err) {
            console.error('[ApiDocsEngine] Failed to load registry:', err);
        }
    }

    private saveState(): void {
        try {
            const dir = path.dirname(REGISTRY_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(this.state, null, 2), 'utf-8');
        } catch (err) {
            console.error('[ApiDocsEngine] Failed to save registry:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Get Canonical API Endpoint Specifications
    public getCanonicalApiEndpoints(): ApiEndpointSpec[] {
        const endpoints: ApiEndpointSpec[] = [
            {
                id: 'get-node-status',
                route: '/api/v1/nodes/status',
                method: 'GET',
                domain: '⚙️ Daemon',
                sdkFunction: 'TelemetryClient.getNodeStatus()',
                sdkUrl: 'https://wnode.one/docs/sdk/api-reference#getNodeStatus',
                summary: 'Fetch real-time node operational status, CPU core count, and memory allocation.',
                responsePayload: '{\n  "status": "online",\n  "uptime_seconds": 184920,\n  "cores": 8\n}',
                version: 'v1.0.1',
                hash: this.calculateHash('get-node-status:v1.0.1')
            },
            {
                id: 'post-mesh-update',
                route: '/api/v1/mesh/update',
                method: 'POST',
                domain: '📡 Telemetry',
                sdkFunction: 'MeshManager.updateMesh()',
                sdkUrl: 'https://wnode.one/docs/sdk/api-reference#updateMesh',
                summary: 'Broadcast p2p gossip state update across the mesh network.',
                samplePayload: '{\n  "peer_id": "12D3KooW...",\n  "dewi_mode": "active"\n}',
                version: 'v1.0.1',
                hash: this.calculateHash('post-mesh-update:v1.0.1')
            },
            {
                id: 'post-soe-tune',
                route: '/api/v1/soe/tune',
                method: 'POST',
                domain: '⚙️ Daemon',
                sdkFunction: 'SOEEngine.tuneRAM()',
                sdkUrl: 'https://wnode.one/docs/sdk/api-reference#tuneRAM',
                summary: 'Trigger autonomous RAM memory re-allocation and packet routing tuning.',
                samplePayload: '{\n  "ram_cap_mb": 4096\n}',
                version: 'v1.0.1',
                hash: this.calculateHash('post-soe-tune:v1.0.1')
            },
            {
                id: 'post-job-submit',
                route: '/api/v1/jobs/submit',
                method: 'POST',
                domain: '🧩 SDK',
                sdkFunction: 'WasmRunner.submitJob()',
                sdkUrl: 'https://wnode.one/docs/sdk/api-reference#submitJob',
                summary: 'Submit deterministic WASM compute job envelope for execution.',
                samplePayload: '{\n  "envelope_id": "env_994821",\n  "timeout_ms": 5000\n}',
                version: 'v1.0.1',
                hash: this.calculateHash('post-job-submit:v1.0.1')
            },
            {
                id: 'ws-telemetry-stream',
                route: '/ws/telemetry',
                method: 'WS',
                domain: '📡 Telemetry',
                sdkFunction: 'TelemetryClient.subscribeStream()',
                sdkUrl: 'https://wnode.one/docs/sdk/api-reference#subscribeStream',
                summary: 'Real-time WebSocket stream of heartbeat events, DeWi telemetry, and WASM envelope logs.',
                version: 'v1.0.1',
                hash: this.calculateHash('ws-telemetry-stream:v1.0.1')
            }
        ];

        return endpoints;
    }

    // 2. Build Endpoint Embed
    public buildEndpointEmbed(spec: ApiEndpointSpec): { embeds: any[]; components: any[] } {
        const methodBadge = `\`${spec.method}\``;
        const domainBadge = `\`${spec.domain}\``;

        const embed = new EmbedBuilder()
            .setTitle(`🔌 Endpoint: ${spec.method} ${spec.route}`)
            .setURL(spec.sdkUrl)
            .setColor(0x3b82f6)
            .setDescription(`**Domain**: ${domainBadge} | **Method**: ${methodBadge} | **Version**: \`${spec.version}\``)
            .addFields([
                {
                    name: '📖 Summary',
                    value: spec.summary,
                    inline: false
                },
                {
                    name: '🧩 SDK Equivalent',
                    value: `• [\`${spec.sdkFunction}\`](${spec.sdkUrl})`,
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • Advanced API Documentation Engine' })
            .setTimestamp();

        if (spec.samplePayload) {
            embed.addFields([
                {
                    name: '📤 Request Payload Example',
                    value: '```json\n' + spec.samplePayload + '\n```',
                    inline: false
                }
            ]);
        }

        if (spec.responsePayload) {
            embed.addFields([
                {
                    name: '📥 Response Payload Example',
                    value: '```json\n' + spec.responsePayload + '\n```',
                    inline: false
                }
            ]);
        }

        embed.addFields([
            {
                name: '📊 Telemetry Stream Flow',
                value: '🖼️ Flowchart: `/assets/illustrations/api-telemetry/websocket-flow.svg`',
                inline: false
            }
        ]);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('📖 View Docs-as-SOT')
                .setStyle(ButtonStyle.Link)
                .setURL(DEFAULT_DOCS_URL),
            new ButtonBuilder()
                .setLabel('🧩 SDK API Reference')
                .setStyle(ButtonStyle.Link)
                .setURL(spec.sdkUrl)
        );

        return { embeds: [embed], components: [row] };
    }

    // 3. Build API Diff Summary Embed
    public buildDiffSummaryEmbed(): { embeds: any[]; components: any[] } {
        const embed = new EmbedBuilder()
            .setTitle('⚡ API Endpoint Diff Summary (v1.0.1)')
            .setColor(0x8b5cf6)
            .setDescription('Summary of recent API route updates, SDK bindings, and schema modifications.')
            .addFields([
                {
                    name: '✨ Added Endpoints',
                    value: '• `POST /api/v1/soe/tune` → [`SOEEngine.tuneRAM()`](https://wnode.one/docs/sdk/api-reference#tuneRAM)\n• `WS /ws/telemetry` → [`TelemetryClient.subscribeStream()`](https://wnode.one/docs/sdk/api-reference#subscribeStream)',
                    inline: false
                },
                {
                    name: '⚙️ Modified Parameters',
                    value: '• `GET /api/v1/nodes/status` — Added `ram_total_gb` and `payout_status` fields.',
                    inline: false
                },
                {
                    name: '🗑 Deprecated Routes',
                    value: '• None. All REST v1 endpoints maintained backwards compatibility.',
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • API Diff Registry' })
            .setTimestamp();

        return { embeds: [embed], components: [] };
    }

    // 4. Process & Post in #api
    public async processAndPostApiDocs(guild: any): Promise<number> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'api');
        if (!channel) {
            console.warn('[ApiDocsEngine] #api channel not found in guild.');
            return 0;
        }

        const endpoints = this.getCanonicalApiEndpoints();
        let postedCount = 0;

        for (const spec of endpoints) {
            if (this.state.postedHashes.includes(spec.hash)) {
                continue; // Anti-noise rule: deduplicated
            }

            const payload = this.buildEndpointEmbed(spec);
            const message = await channel.send(payload);

            // Pin latest API summary & unpin older ones
            try {
                const pinned = await channel.messages.fetchPinned();
                for (const [id, msg] of pinned) {
                    if (id !== message.id && msg.author.id === guild.client.user.id) {
                        await msg.unpin().catch(() => {});
                    }
                }
                await message.pin().catch(() => {});
            } catch (err) {
                console.error('[ApiDocsEngine] Failed to manage message pins:', err);
            }

            this.state.postedHashes.push(spec.hash);
            postedCount++;
        }

        // Post API Diff Summary if new endpoints posted
        if (postedCount > 0) {
            const diffPayload = this.buildDiffSummaryEmbed();
            await channel.send(diffPayload);

            // Record Audit Registry
            const auditRecord: ApiRegistryRecord = {
                version: 'v1.0.1',
                author: 'Wnode Bot / Core Team',
                commitHash: 'd9e959119',
                sdkLinkMap: {
                    '/api/v1/nodes/status': 'TelemetryClient.getNodeStatus()',
                    '/api/v1/mesh/update': 'MeshManager.updateMesh()',
                    '/api/v1/soe/tune': 'SOEEngine.tuneRAM()',
                    '/api/v1/jobs/submit': 'WasmRunner.submitJob()'
                },
                diffSummary: {
                    added: ['/api/v1/soe/tune', '/ws/telemetry'],
                    modified: ['/api/v1/nodes/status'],
                    deprecated: []
                },
                timestamp: new Date().toISOString()
            };

            this.state.registry.push(auditRecord);
            this.saveState();
        }

        return postedCount;
    }
}
