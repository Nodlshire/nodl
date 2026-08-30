import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

export type GuideCategory = 'Deployment' | 'Configuration' | 'Performance' | 'Troubleshooting' | 'Telemetry';

export interface OperatorGuide {
    id: string;
    title: string;
    category: GuideCategory;
    isCritical?: boolean;
    version: string;
    summary: string;
    commands: string[];
    sourceFile: string;
    lastUpdated: string;
    hash: string;
}

export interface GuidesRegistryRecord {
    guideId: string;
    sourceFile: string;
    category: GuideCategory;
    version: string;
    commitHash: string;
    severity: 'normal' | 'critical';
    timestamp: string;
}

export interface OperatorGuidesState {
    postedHashes: string[];
    registry: GuidesRegistryRecord[];
    introMessageId?: string;
    introMessageHash?: string;
    categoryIndexIds?: { [cat in GuideCategory]?: string };
}

const REGISTRY_PATH = process.env.OPERATOR_GUIDES_REGISTRY_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/operator-guides-registry.json'
        : path.resolve(__dirname, '../../services/nodld/state/operator-guides-registry.json'));

export class OperatorGuidesEngine {
    private state: OperatorGuidesState = { postedHashes: [], registry: [], categoryIndexIds: {} };
    private docsPath: string;

    constructor(docsPath?: string) {
        this.docsPath = docsPath || path.resolve(__dirname, '../../../docs');
        this.loadState();
    }

    private loadState(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                this.state = JSON.parse(data);
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

    // 1. Ensure Pinned Intro Message in #operator-guides
    public async ensureOperatorChannelIntro(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'operator-guides' || c.id === '1540912010890707014');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'operator-guides' || c?.id === '1540912010890707014');
        }
        if (!channel) return;

        const introText =
            '🧩 **Welcome to #operator‑guides!**\n' +
            'This channel is your hub for advanced operator documentation — from headless Linux deployment to performance tuning and telemetry optimization.\n' +
            'Here you’ll find:\n' +
            '• Step‑by‑step deployment guides for Wnode and Node Operator environments.\n' +
            '• Configuration examples for PM2, systemd, and Docker.\n' +
            '• Performance tuning tips for CPU, memory, and network throughput.\n' +
            '• Troubleshooting workflows and telemetry validation scripts.\n' +
            'Share your own optimizations or ask for help with edge‑case setups — our operator community thrives on precision and collaboration.';

        const currentHash = this.calculateHash(introText);
        if (this.state.introMessageHash === currentHash && this.state.introMessageId) {
            return; // Anti-noise rule: silent update / noop
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && (msg.content.includes('Welcome to #operator') || msg.embeds[0]?.title?.includes('operator'))) {
                    existingPinned = msg;
                    break;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('🧩 Welcome to #operator‑guides!')
                .setColor(0x3B82F6)
                .setDescription(
                    'This channel is your hub for advanced operator documentation — from headless Linux deployment to performance tuning and telemetry optimization.\n\n' +
                    'Here you’ll find:\n' +
                    '• **Step‑by‑step deployment guides** for Wnode and Node Operator environments.\n' +
                    '• **Configuration examples** for PM2, systemd, and Docker.\n' +
                    '• **Performance tuning tips** for CPU, memory, and network throughput.\n' +
                    '• **Troubleshooting workflows** and telemetry validation scripts.\n\n' +
                    'Share your own optimizations or ask for help with edge‑case setups — our operator community thrives on precision and collaboration.'
                )
                .setFooter({ text: 'Wnode Sovereign Mesh • Technical Documentation Hub' })
                .setTimestamp();

            if (existingPinned) {
                await existingPinned.edit({ content: introText, embeds: [embed] });
                this.state.introMessageId = existingPinned.id;
            } else {
                const message = await channel.send({ content: introText, embeds: [embed] });
                await message.pin().catch(() => {});
                this.state.introMessageId = message.id;
            }

            this.state.introMessageHash = currentHash;
            this.saveState();
            console.log('[OperatorGuidesEngine] ✅ Ensured #operator-guides intro message is active and pinned.');
        } catch (err) {
            console.error('[OperatorGuidesEngine] Failed to ensure channel intro:', err);
        }
    }

    // 2. Generate Canonical Operator Guides
    public getCanonicalGuides(): OperatorGuide[] {
        const now = new Date().toISOString();

        return [
            {
                id: 'headless-linux-deployment',
                title: 'Headless Linux Deployment (PM2, systemd & Docker)',
                category: 'Deployment',
                isCritical: true,
                version: 'v1.1.0',
                summary: 'Deploy nodld on headless Ubuntu/Debian/Fedora servers using PM2, systemd unit files, or containerized Docker builds.',
                commands: [
                    'curl -fsSL https://nodlr.wnode.one/install.sh | bash',
                    'sudo systemctl enable --now nodld',
                    'pm2 start nodld --name "wnode-daemon"'
                ],
                sourceFile: '04-node-operator/getting-started.md',
                lastUpdated: now,
                hash: this.calculateHash('headless-linux-deployment:v1.1.0')
            },
            {
                id: 'operator-configuration-environment',
                title: 'Network Interfaces, operator.json & Environment Config',
                category: 'Configuration',
                isCritical: false,
                version: 'v1.0.2',
                summary: 'Comprehensive reference for operator.json config keys, environment variable overrides, and multi-interface binding.',
                commands: [
                    'cat ~/.config/wnode/operator.json',
                    'export WNODE_API_BASE="https://cmd.wnode.one"',
                    './nodld --config-validate'
                ],
                sourceFile: '04-node-operator/operator-guide.md',
                lastUpdated: now,
                hash: this.calculateHash('operator-configuration-environment:v1.0.2')
            },
            {
                id: 'zero-storage-ram-performance',
                title: 'CPU Tuning, RAM Optimization & Substrate Throughput',
                category: 'Performance',
                isCritical: false,
                version: 'v1.0.3',
                summary: 'Fine-tune CPU core pinning, ephemeral RAM memory substrates, WASM thread pools, and zero-storage network throughput.',
                commands: [
                    'export NODE_OPTIONS="--max-old-space-size=4096"',
                    './nodld --tune-ram --soe-mode=active',
                    'cpupower frequency-set -g performance'
                ],
                sourceFile: '04-node-operator/performance-tuning.md',
                lastUpdated: now,
                hash: this.calculateHash('zero-storage-ram-performance:v1.0.3')
            },
            {
                id: 'peer-discovery-troubleshooting',
                title: 'Peer Discovery, Websocket Reconnects & Diagnostic Logs',
                category: 'Troubleshooting',
                isCritical: false,
                version: 'v1.0.2',
                summary: 'Step-by-step diagnostic workflows for NAT traversal, peer discovery timeouts, websocket reconnects, and log analysis.',
                commands: [
                    './nodld --diagnose',
                    'journalctl -u nodld -n 100 --no-pager',
                    'tail -n 100 /var/log/nodld.log'
                ],
                sourceFile: '04-node-operator/troubleshooting-guide.md',
                lastUpdated: now,
                hash: this.calculateHash('peer-discovery-troubleshooting:v1.0.2')
            },
            {
                id: 'telemetry-validation-metrics',
                title: 'Telemetry Validation Scripts, Health Checks & System Pulse',
                category: 'Telemetry',
                isCritical: false,
                version: 'v1.0.1',
                summary: 'Validation scripts for real-time telemetry pulse verification, health threshold interpretation, and node metrics.',
                commands: [
                    'curl -s http://localhost:8080/api/v1/system/pulse',
                    'curl -s http://localhost:8080/api/status | jq .'
                ],
                sourceFile: '04-node-operator/telemetry-guide.md',
                lastUpdated: now,
                hash: this.calculateHash('telemetry-validation-metrics:v1.0.1')
            }
        ];
    }

    // 3. Build Guide Embed
    public buildGuideEmbed(guide: OperatorGuide): { content?: string; embeds: any[]; components: any[] } {
        const embed = new EmbedBuilder()
            .setTitle(`Operator Guide — ${guide.title}`)
            .setColor(0x3B82F6)
            .setDescription(`**Category**: \`${guide.category}\` | **Version**: \`${guide.version}\` | **File**: \`${guide.sourceFile}\``)
            .addFields([
                { name: '📖 Overview', value: guide.summary, inline: false },
                { name: '💻 Terminal Commands', value: '```bash\n' + guide.commands.join('\n') + '\n```', inline: false }
            ])
            .setFooter({ text: `Synced from Wnode Docs — ${new Date(guide.lastUpdated).toUTCString()}` })
            .setTimestamp(new Date(guide.lastUpdated));

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

        let content = undefined;
        if (guide.isCritical) {
            content = `🚨 **CRITICAL DEPLOYMENT UPDATE** <@&1540911984898474015>`;
        }

        return { content, embeds: [embed], components: [row] };
    }

    // 4. Process & Post Guides in #operator-guides
    public async processAndPostGuides(guild: any): Promise<number> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'operator-guides' || c.id === '1540912010890707014');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'operator-guides' || c?.id === '1540912010890707014');
        }
        if (!channel) return 0;

        const guides = this.getCanonicalGuides();
        let updatedCount = 0;

        for (const guide of guides) {
            if (this.state.postedHashes.includes(guide.hash)) {
                continue; // Deduplicated
            }

            const payload = this.buildGuideEmbed(guide);
            await channel.send(payload);

            // Audit Registry Record
            const auditRecord: GuidesRegistryRecord = {
                guideId: guide.id,
                sourceFile: guide.sourceFile,
                category: guide.category,
                version: guide.version,
                commitHash: 'bcce3486b',
                severity: guide.isCritical ? 'critical' : 'normal',
                timestamp: new Date().toISOString()
            };

            this.state.postedHashes.push(guide.hash);
            this.state.registry.push(auditRecord);
            updatedCount++;

            // Pulse Audit Log
            await this.logPulseAudit(guide);
        }

        if (updatedCount > 0) {
            this.saveState();
        }

        return updatedCount;
    }

    // 5. Audit Log to /api/v1/system/pulse
    private async logPulseAudit(guide: OperatorGuide): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'operator_guide_published',
                    guide_file: guide.sourceFile,
                    category: guide.category,
                    timestamp: new Date().toISOString(),
                    commit_hash: 'bcce3486b',
                    severity: guide.isCritical ? 'critical' : 'normal',
                    source: 'discord_operator_guides'
                })
            });
        } catch (err) {
            console.error('[OperatorGuidesEngine] Failed to log pulse audit:', err);
        }
    }
}
