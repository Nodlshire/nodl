import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

export interface OperatorGuide {
    id: string;
    title: string;
    category: '🧠 Headless Deployment' | '⚙️ Performance Optimization' | '🖥️ UI Features' | '🧩 Troubleshooting';
    version: string;
    summary: string;
    commands: string[];
    diagramFile: string;
    improvedViaFeedback?: boolean;
    lastUpdated: string;
    hash: string;
}

export interface GuidesRegistryRecord {
    guideId: string;
    version: string;
    author: string;
    commitHash?: string;
    feedbackSource?: string;
    diagramReferences: string[];
    timestamp: string;
}

export interface OperatorGuidesState {
    postedHashes: string[];
    registry: GuidesRegistryRecord[];
    pinnedMessageId?: string;
}

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/operator-guides-registry.json');
const DIAGRAMS_DIR = path.resolve(__dirname, '../../../assets/illustrations/operator-flows');

export class OperatorGuidesEngine {
    private state: OperatorGuidesState = { postedHashes: [], registry: [] };
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
                    this.state.postedHashes = parsed.map(p => p.guideId + ':' + p.version);
                } else {
                    this.state = parsed;
                }
            }
        } catch (err) {
            console.error('[OperatorGuidesEngine] Failed to load registry:', err);
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
            console.error('[OperatorGuidesEngine] Failed to save registry:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Generate Canonical Operator Guides
    public getCanonicalGuides(): OperatorGuide[] {
        const now = new Date().toISOString();

        const guides: OperatorGuide[] = [
            {
                id: 'headless-linux-setup',
                title: '🧠 Headless Linux Node Deployment',
                category: '🧠 Headless Deployment',
                version: 'v1.0.1',
                summary: 'Deploy nodld on headless Ubuntu/Debian/Fedora servers with 1-line binary installer.',
                commands: [
                    'curl -fsSL https://nodlr.wnode.one/install.sh | bash',
                    './nodld --status',
                    'journalctl -u nodld -f'
                ],
                diagramFile: 'deployment-flow.svg',
                lastUpdated: now,
                hash: this.calculateHash('headless-linux-setup:v1.0.1')
            },
            {
                id: 'ram-performance-tuning',
                title: '⚙️ Zero-Storage RAM & DeWi Tuning',
                category: '⚙️ Performance Optimization',
                version: 'v1.0.1',
                summary: 'Optimize ephemeral RAM memory substrate, WASM thread pools, and 5G/LoRaWAN packet routing.',
                commands: [
                    'export NODE_OPTIONS="--max-old-space-size=4096"',
                    './nodld --tune-ram --dewi-mode=active'
                ],
                diagramFile: 'telemetry-flow.svg',
                lastUpdated: now,
                hash: this.calculateHash('ram-performance-tuning:v1.0.1')
            },
            {
                id: 'command-ui-integration',
                title: '🖥️ Command UI Dashboard & Telemetry',
                category: '🖥️ UI Features',
                version: 'v1.0.1',
                summary: 'Connect nodld daemon to cmd.wnode.one for real-time compute visualization and Stripe payouts.',
                commands: [
                    'curl -s http://localhost:8080/api/status',
                    'https://cmd.wnode.one'
                ],
                diagramFile: 'ui-workflow.svg',
                lastUpdated: now,
                hash: this.calculateHash('command-ui-integration:v1.0.1')
            },
            {
                id: 'daemon-troubleshooting-guide',
                title: '🧩 Node Operator Troubleshooting Console',
                category: '🧩 Troubleshooting',
                version: 'v1.0.1',
                summary: 'Step-by-step diagnostic workflows for peer discovery, websocket reconnects, and WASM envelope errors.',
                commands: [
                    './nodld --diagnose',
                    'tail -n 100 /var/log/nodld.log'
                ],
                diagramFile: 'deployment-flow.svg',
                improvedViaFeedback: true,
                lastUpdated: now,
                hash: this.calculateHash('daemon-troubleshooting-guide:v1.0.1')
            }
        ];

        return guides;
    }

    // 2. Build Guide Embed
    public buildGuideEmbed(guide: OperatorGuide): { embeds: any[]; components: any[] } {
        const embed = new EmbedBuilder()
            .setTitle(guide.title)
            .setColor(0x3b82f6)
            .setDescription(`**Category**: \`${guide.category}\` | **Version**: \`${guide.version}\``)
            .addFields([
                {
                    name: '📖 Overview & Workflow',
                    value: guide.summary,
                    inline: false
                },
                {
                    name: '💻 Terminal Commands',
                    value: '```bash\n' + guide.commands.join('\n') + '\n```',
                    inline: false
                },
                {
                    name: '📊 Visual Workflow Diagram',
                    value: `🖼️ Diagram Reference: \`/assets/illustrations/operator-flows/${guide.diagramFile}\``,
                    inline: false
                }
            ])
            .setFooter({
                text: guide.improvedViaFeedback
                    ? `Wnode Sovereign Mesh • Improved via Feedback Loop • Updated ${guide.lastUpdated.split('T')[0]}`
                    : `Wnode Sovereign Mesh • Operator Guides Engine • Updated ${guide.lastUpdated.split('T')[0]}`
            })
            .setTimestamp();

        if (guide.improvedViaFeedback) {
            embed.addFields([
                {
                    name: '💡 Feedback Loop Status',
                    value: '✨ **Improved via Feedback Loop**: Incorporates verified community fixes from `#beta-feedback`.',
                    inline: false
                }
            ]);
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('📖 View Full Docs')
                .setStyle(ButtonStyle.Link)
                .setURL('https://wnode.one/docs/04-node-operator/operator-guide'),
            new ButtonBuilder()
                .setLabel('🚀 Run Binary Installer')
                .setStyle(ButtonStyle.Link)
                .setURL('https://nodlr.wnode.one')
        );

        return { embeds: [embed], components: [row] };
    }

    // 3. Process & Post/Pin Guides in #operator-guides
    public async processAndPostGuides(guild: any): Promise<number> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'operator-guides');
        if (!channel) {
            console.warn('[OperatorGuidesEngine] #operator-guides channel not found in guild.');
            return 0;
        }

        const guides = this.getCanonicalGuides();
        let updatedCount = 0;

        for (const guide of guides) {
            if (this.state.postedHashes.includes(guide.hash)) {
                continue; // Anti-noise rule: deduplicated
            }

            const payload = this.buildGuideEmbed(guide);
            const message = await channel.send(payload);

            // Pin latest guide embed & unpin older ones
            try {
                const pinned = await channel.messages.fetchPinned();
                for (const [id, msg] of pinned) {
                    if (id !== message.id && msg.author.id === guild.client.user.id) {
                        await msg.unpin().catch(() => {});
                    }
                }
                await message.pin().catch(() => {});
            } catch (err) {
                console.error('[OperatorGuidesEngine] Failed to manage message pins:', err);
            }

            // Audit Registry Record
            const auditRecord: GuidesRegistryRecord = {
                guideId: guide.id,
                version: guide.version,
                author: 'Wnode Bot / Core Team',
                commitHash: 'bcce3486b',
                feedbackSource: guide.improvedViaFeedback ? '#beta-feedback' : undefined,
                diagramReferences: [`/assets/illustrations/operator-flows/${guide.diagramFile}`],
                timestamp: new Date().toISOString()
            };

            this.state.postedHashes.push(guide.hash);
            this.state.registry.push(auditRecord);
            updatedCount++;
        }

        if (updatedCount > 0) {
            this.saveState();
        }

        return updatedCount;
    }
}
