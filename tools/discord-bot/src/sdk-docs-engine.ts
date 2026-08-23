import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

export interface SdkMethodSpec {
    id: string;
    sdkName: 'Go SDK' | 'WASM SDK' | 'TypeScript SDK';
    domain: '🧠 Go' | '🕸️ WASM' | '📡 Telemetry' | '⚙️ Mesh' | '🔐 Auth';
    methodName: string;
    version: string;
    summary: string;
    linkedApiRoute: string;
    linkedApiUrl: string;
    codeExample: string;
    diagramFile: string;
    hash: string;
}

export interface SdkRegistryRecord {
    version: string;
    author: string;
    commitHash: string;
    apiLinkMap: { [sdkMethod: string]: string };
    diffSummary: {
        added: string[];
        modified: string[];
        deprecated: string[];
    };
    timestamp: string;
}

export interface SdkState {
    postedHashes: string[];
    registry: SdkRegistryRecord[];
    pinnedMessageId?: string;
}

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/sdk-registry.json');
const DEFAULT_DOCS_URL = 'https://wnode.one/docs/sdk';

export class SdkDocsEngine {
    private state: SdkState = { postedHashes: [], registry: [] };
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
            console.error('[SdkDocsEngine] Failed to load registry:', err);
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
            console.error('[SdkDocsEngine] Failed to save registry:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Get Canonical SDK Specifications
    public getCanonicalSdkSpecs(): SdkMethodSpec[] {
        const specs: SdkMethodSpec[] = [
            {
                id: 'go-get-node-status',
                sdkName: 'Go SDK',
                domain: '🧠 Go',
                methodName: 'TelemetryClient.GetNodeStatus()',
                version: 'v1.0.1',
                summary: 'Fetch real-time node operational status, core count, and RAM metrics in Go.',
                linkedApiRoute: 'GET /api/v1/nodes/status',
                linkedApiUrl: 'https://wnode.one/docs/02-api#get-node-status',
                codeExample: 'client := sdk.NewTelemetryClient("http://localhost:8080")\nstatus, err := client.GetNodeStatus()',
                diagramFile: 'sdk-daemon-flow.svg',
                hash: this.calculateHash('go-get-node-status:v1.0.1')
            },
            {
                id: 'wasm-submit-job',
                sdkName: 'WASM SDK',
                domain: '🕸️ WASM',
                methodName: 'WasmRunner.submitJob()',
                version: 'v1.0.1',
                summary: 'Submit deterministic WASM compute job envelope for zero-storage execution.',
                linkedApiRoute: 'POST /api/v1/jobs/submit',
                linkedApiUrl: 'https://wnode.one/docs/02-api#post-job-submit',
                codeExample: 'const runner = new WasmRunner({ endpoint: "http://localhost:8080" });\nconst res = await runner.submitJob({ envelopeId: "env_994821" });',
                diagramFile: 'wasm-envelope-flow.svg',
                hash: this.calculateHash('wasm-submit-job:v1.0.1')
            },
            {
                id: 'mesh-update-sdk',
                sdkName: 'Go SDK',
                domain: '⚙️ Mesh',
                methodName: 'MeshManager.UpdateMesh()',
                version: 'v1.0.1',
                summary: 'Broadcast p2p gossip state update across the mesh network via Go client.',
                linkedApiRoute: 'POST /api/v1/mesh/update',
                linkedApiUrl: 'https://wnode.one/docs/02-api#post-mesh-update',
                codeExample: 'mesh := sdk.NewMeshManager(config)\nerr := mesh.UpdateMesh(peerID, "active")',
                diagramFile: 'sdk-daemon-flow.svg',
                hash: this.calculateHash('mesh-update-sdk:v1.0.1')
            },
            {
                id: 'telemetry-subscribe-stream',
                sdkName: 'TypeScript SDK',
                domain: '📡 Telemetry',
                methodName: 'TelemetryClient.subscribeStream()',
                version: 'v1.0.1',
                summary: 'Subscribe to WebSocket telemetry heartbeat stream for live Node & DeWi updates.',
                linkedApiRoute: 'WS /ws/telemetry',
                linkedApiUrl: 'https://wnode.one/docs/02-api#ws-telemetry-stream',
                codeExample: 'client.subscribeStream((event) => {\n  console.log("Telemetry Heartbeat:", event);\n});',
                diagramFile: 'sdk-daemon-flow.svg',
                hash: this.calculateHash('telemetry-subscribe-stream:v1.0.1')
            }
        ];

        return specs;
    }

    // 2. Build SDK Guide Embed
    public buildSdkEmbed(spec: SdkMethodSpec): { embeds: any[]; components: any[] } {
        const domainBadge = `\`${spec.domain}\``;

        const embed = new EmbedBuilder()
            .setTitle(`🧩 ${spec.sdkName}: ${spec.methodName}`)
            .setURL(DEFAULT_DOCS_URL)
            .setColor(0x3b82f6)
            .setDescription(`**Domain**: ${domainBadge} | **Version**: \`${spec.version}\``)
            .addFields([
                {
                    name: '📖 Summary',
                    value: spec.summary,
                    inline: false
                },
                {
                    name: '🔌 Linked API Endpoint',
                    value: `• [\`${spec.linkedApiRoute}\`](${spec.linkedApiUrl})`,
                    inline: false
                },
                {
                    name: '💻 Integration Example Code',
                    value: '```typescript\n' + spec.codeExample + '\n```',
                    inline: false
                },
                {
                    name: '📊 Integration Workflow Diagram',
                    value: `🖼️ Flowchart: \`/assets/illustrations/sdk-flows/${spec.diagramFile}\``,
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • Intelligent SDK Documentation Engine' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('📖 View Full Docs')
                .setStyle(ButtonStyle.Link)
                .setURL(DEFAULT_DOCS_URL),
            new ButtonBuilder()
                .setLabel('📦 GitHub Repository')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/wnodeltd/wnode')
        );

        return { embeds: [embed], components: [row] };
    }

    // 3. Build SDK Diff Summary Embed
    public buildSdkDiffSummaryEmbed(): { embeds: any[]; components: any[] } {
        const embed = new EmbedBuilder()
            .setTitle('⚡ SDK Release Diff Summary (v1.0.1)')
            .setColor(0x8b5cf6)
            .setDescription('Summary of recent Go, WASM, and TypeScript SDK additions and API bindings.')
            .addFields([
                {
                    name: '✨ Added Methods',
                    value: '• `WasmRunner.submitJob()` → Linked to [`POST /api/v1/jobs/submit`](https://wnode.one/docs/02-api#post-job-submit)\n• `SOEEngine.tuneRAM()` → Linked to [`POST /api/v1/soe/tune`](https://wnode.one/docs/02-api#post-soe-tune)',
                    inline: false
                },
                {
                    name: '⚙️ Modified Parameters',
                    value: '• `TelemetryClient.getNodeStatus()` — Added `RAMTotalGB` struct field response.',
                    inline: false
                },
                {
                    name: '🗑 Deprecated Functions',
                    value: '• None. Backwards compatibility preserved across all SDK exports.',
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • SDK Registry' })
            .setTimestamp();

        return { embeds: [embed], components: [] };
    }

    // 4. Process & Post in #sdk
    public async processAndPostSdkDocs(guild: any): Promise<number> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'sdk');
        if (!channel) {
            console.warn('[SdkDocsEngine] #sdk channel not found in guild.');
            return 0;
        }

        const specs = this.getCanonicalSdkSpecs();
        let postedCount = 0;

        for (const spec of specs) {
            if (this.state.postedHashes.includes(spec.hash)) {
                continue; // Anti-noise rule: deduplicated
            }

            const payload = this.buildSdkEmbed(spec);
            const message = await channel.send(payload);

            // Pin latest SDK guide embed & unpin older ones
            try {
                const pinned = await channel.messages.fetchPinned();
                for (const [id, msg] of pinned) {
                    if (id !== message.id && msg.author.id === guild.client.user.id) {
                        await msg.unpin().catch(() => {});
                    }
                }
                await message.pin().catch(() => {});
            } catch (err) {
                console.error('[SdkDocsEngine] Failed to manage message pins:', err);
            }

            this.state.postedHashes.push(spec.hash);
            postedCount++;
        }

        // Post SDK Diff Summary if new methods posted
        if (postedCount > 0) {
            const diffPayload = this.buildSdkDiffSummaryEmbed();
            await channel.send(diffPayload);

            // Audit Registry Record
            const auditRecord: SdkRegistryRecord = {
                version: 'v1.0.1',
                author: 'Wnode Bot / Core Team',
                commitHash: '5ebebbbfd',
                apiLinkMap: {
                    'TelemetryClient.GetNodeStatus()': '/api/v1/nodes/status',
                    'WasmRunner.submitJob()': '/api/v1/jobs/submit',
                    'MeshManager.UpdateMesh()': '/api/v1/mesh/update',
                    'TelemetryClient.subscribeStream()': '/ws/telemetry'
                },
                diffSummary: {
                    added: ['WasmRunner.submitJob()', 'SOEEngine.tuneRAM()'],
                    modified: ['TelemetryClient.GetNodeStatus()'],
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
