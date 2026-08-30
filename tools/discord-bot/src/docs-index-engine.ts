import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

export type DocsIndexCategory =
    | 'Operator Guides'
    | 'Security & Disclosure'
    | 'System Architecture'
    | 'Developer Docs'
    | 'Telemetry & Analytics';

export interface DocsIndexCategoryGroup {
    category: DocsIndexCategory;
    icon: string;
    description: string;
    pathPrefix: string;
    items: { title: string; url: string; summary: string }[];
}

export interface DocsIndexState {
    postedHashes: string[];
    introMessageId?: string;
    introMessageHash?: string;
}

const REGISTRY_PATH = process.env.DOCS_INDEX_REGISTRY_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/docs-index-registry.json'
        : path.resolve(__dirname, '../../services/nodld/state/docs-index-registry.json'));

export class DocsIndexEngine {
    private state: DocsIndexState = { postedHashes: [] };
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
            console.error('[DocsIndexEngine] Failed to load state:', err);
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
            console.error('[DocsIndexEngine] Failed to save state:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Ensure Pinned Master Header in #docs-index
    public async ensureDocsIndexHeader(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'docs-index' || c.id === '1540912034755903498');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'docs-index' || c?.id === '1540912034755903498');
        }
        if (!channel) return;

        const introText =
            '📚 **Welcome to #docs‑index!**\n' +
            'This channel serves as the master index for Wnode documentation.\n' +
            'All canonical guides, operator manuals, and system references are organized here for quick access.\n' +
            'Each section below links directly to its source in `/docs/INDEX.md` and updates automatically when documentation changes.\n\n' +
            '**Documentation Categories:**\n' +
            '• 🧩 **Operator Guides** — Deployment, configuration, and performance tuning.\n' +
            '• 🔐 **Security & Disclosure** — Vulnerability reporting and cryptographic advisories.\n' +
            '• ⚙️ **System Architecture** — Node internals, telemetry, and API references.\n' +
            '• 🧠 **Developer Docs** — SDKs, endpoints, and integration examples.\n' +
            '• 📊 **Telemetry & Analytics** — Pulse metrics, validation scripts, and dashboards.';

        const currentHash = this.calculateHash(introText);
        if (this.state.introMessageHash === currentHash && this.state.introMessageId) {
            return;
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && (msg.content.includes('Welcome to #docs') || msg.embeds[0]?.title?.includes('docs'))) {
                    existingPinned = msg;
                    break;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('📚 Welcome to #docs‑index!')
                .setColor(0x3B82F6)
                .setDescription(
                    'This channel serves as the master index for Wnode documentation.\n' +
                    'All canonical guides, operator manuals, and system references are organized here for quick access.\n' +
                    'Each section below links directly to its source in `/docs/INDEX.md` and updates automatically when documentation changes.\n\n' +
                    '**Documentation Categories:**\n' +
                    '• 🧩 **Operator Guides** — Deployment, configuration, and performance tuning.\n' +
                    '• 🔐 **Security & Disclosure** — Vulnerability reporting and cryptographic advisories.\n' +
                    '• ⚙️ **System Architecture** — Node internals, telemetry, and API references.\n' +
                    '• 🧠 **Developer Docs** — SDKs, endpoints, and integration examples.\n' +
                    '• 📊 **Telemetry & Analytics** — Pulse metrics, validation scripts, and dashboards.'
                )
                .setFooter({ text: 'Wnode Sovereign Mesh • Master Documentation Index' })
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
            console.log('[DocsIndexEngine] ✅ Ensured #docs-index header message is active and pinned.');
        } catch (err) {
            console.error('[DocsIndexEngine] Failed to ensure #docs-index header:', err);
        }
    }

    // 2. Parse Canonical Category Groups
    public getCategoryGroups(): DocsIndexCategoryGroup[] {
        return [
            {
                category: 'Operator Guides',
                icon: '🧩',
                description: 'Deployment, configuration, and performance tuning manuals.',
                pathPrefix: '04-node-operator',
                items: [
                    { title: 'Headless Linux Deployment', url: 'https://wnode.one/docs/04-node-operator/getting-started', summary: 'Binary, systemd, and PM2 deployment' },
                    { title: 'Operator Configuration & Env Vars', url: 'https://wnode.one/docs/04-node-operator/operator-guide', summary: 'operator.json configuration keys' },
                    { title: 'Performance & RAM Tuning', url: 'https://wnode.one/docs/04-node-operator/performance-tuning', summary: 'Zero-storage substrate optimization' }
                ]
            },
            {
                category: 'Security & Disclosure',
                icon: '🔐',
                description: 'Vulnerability reporting, cryptographic advisories, and SAIF compliance.',
                pathPrefix: '02-security',
                items: [
                    { title: 'Responsible Disclosure Policy', url: 'https://wnode.one/docs/02-security/disclosure', summary: 'Confidential report submission' },
                    { title: 'Cryptographic Security Specs', url: 'https://wnode.one/docs/02-security/specs', summary: 'Signing keys and HMAC verification' }
                ]
            },
            {
                category: 'System Architecture',
                icon: '⚙️',
                description: 'Node internals, peer routing, and system architecture.',
                pathPrefix: '01-architecture',
                items: [
                    { title: 'Sovereign Compute Architecture', url: 'https://wnode.one/docs/01-architecture/overview', summary: 'nodld daemon & mesh topologies' },
                    { title: 'Gossip Protocol & P2P Routing', url: 'https://wnode.one/docs/01-architecture/p2p', summary: 'Peer discovery & threshold sync' }
                ]
            },
            {
                category: 'Developer Docs',
                icon: '🧠',
                description: 'SDKs, Fiber v2 API endpoints, and WASM envelope specs.',
                pathPrefix: '05-developer',
                items: [
                    { title: 'REST API v1 Specification', url: 'https://wnode.one/docs/02-api/README', summary: 'Fiber v2 REST API reference' },
                    { title: 'TypeScript / Go SDK Guide', url: 'https://wnode.one/docs/05-developer/sdk', summary: 'Client SDK integration' }
                ]
            },
            {
                category: 'Telemetry & Analytics',
                icon: '📊',
                description: 'Pulse metrics, validation scripts, and Command UI telemetry.',
                pathPrefix: '08-operations',
                items: [
                    { title: 'System Pulse & Telemetry Protocol', url: 'https://wnode.one/docs/08-operations/telemetry', summary: 'Real-time telemetry pulse metrics' },
                    { title: 'Command UI Dashboard Specs', url: 'https://wnode.one/docs/08-operations/command-ui', summary: 'CMD visualization integration' }
                ]
            }
        ];
    }

    // 3. Build Category Index Embed
    public buildCategoryEmbed(group: DocsIndexCategoryGroup): { embeds: any[]; components: any[] } {
        const lines = group.items.map(item => `• [${item.title}](${item.url}) — *${item.summary}*`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`Documentation Index — ${group.category}`)
            .setColor(0x3B82F6)
            .setDescription(`${group.icon} **${group.description}**\n\n${lines}`)
            .setFooter({ text: `Synced from Wnode Docs — ${new Date().toUTCString()}` })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(`📖 Explore ${group.category}`)
                .setStyle(ButtonStyle.Link)
                .setURL('https://wnode.one/docs')
        );

        return { embeds: [embed], components: [row] };
    }

    // 4. Process and Post Docs Index Categories
    public async processAndPostDocsIndex(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'docs-index' || c.id === '1540912034755903498');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'docs-index' || c?.id === '1540912034755903498');
        }
        if (!channel) return;

        const groups = this.getCategoryGroups();

        for (const group of groups) {
            const groupHash = this.calculateHash(JSON.stringify(group));
            if (this.state.postedHashes.includes(groupHash)) {
                continue; // Deduplicated
            }

            const payload = this.buildCategoryEmbed(group);
            await channel.send(payload);

            this.state.postedHashes.push(groupHash);
            this.saveState();

            // Audit Pulse
            await this.logPulseAudit(group.category);
            console.log(`[DocsIndexEngine] ✅ Published category index embed for ${group.category}`);
        }
    }

    // 5. Audit Log to /api/v1/system/pulse
    private async logPulseAudit(category: string): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'docs_index_updated',
                    category,
                    timestamp: new Date().toISOString(),
                    source: 'discord_docs_index'
                })
            });
        } catch (err) {
            console.error('[DocsIndexEngine] Failed to log pulse audit:', err);
        }
    }
}
