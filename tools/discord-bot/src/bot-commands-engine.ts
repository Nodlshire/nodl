import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder } = require('discord.js');

export interface CommandCategoryReference {
    group: string;
    icon: string;
    commands: { syntax: string; description: string; example: string }[];
}

export interface BotCommandsConsoleState {
    introMessageId?: string;
    introMessageHash?: string;
    categoryPinIds?: { [key: string]: string };
}

const REGISTRY_PATH = process.env.BOT_COMMANDS_REGISTRY_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/bot-commands-registry.json'
        : path.resolve(__dirname, '../../services/nodld/state/bot-commands-registry.json'));

export class BotCommandsConsoleEngine {
    private state: BotCommandsConsoleState = { categoryPinIds: {} };

    constructor() {
        this.loadState();
    }

    private loadState(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                this.state = JSON.parse(data);
            }
        } catch (err) {
            console.error('[BotCommandsConsoleEngine] Failed to load state:', err);
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
            console.error('[BotCommandsConsoleEngine] Failed to save state:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Ensure Pinned Channel Intro Header in #bot-commands
    public async ensureConsoleHeader(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'bot-commands' || c.id === '1540912039537410071');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'bot-commands' || c?.id === '1540912039537410071');
        }
        if (!channel) return;

        const introText =
            '🤖 **Welcome to #bot‑commands!**\n' +
            'This channel is your interactive command console for Wnode automation.\n' +
            'Use the commands below to query documentation, operator status, telemetry, and system metrics.\n\n' +
            '**Available Commands:**\n' +
            '• `!docs [topic]` — Fetch documentation from `/docs/INDEX.md` or category subfolders.\n' +
            '• `!search [keyword]` — Search across all indexed documentation & Q&A entries.\n' +
            '• `!qa [question]` — Autonomous RAG query against canonical Docs SOT.\n' +
            '• `!operator [status|config|logs]` — Query Node Operator telemetry and configuration.\n' +
            '• `!dewi [pulse|mesh|network]` — Retrieve DePIN and sovereign compute metrics.\n' +
            '• `!mesh [nodes|latency|peers]` — Display live mesh topology and peer health.\n' +
            '• `!status` — Show system uptime, version, and audit pulse summary.\n\n' +
            'All commands are logged to `/api/v1/system/pulse` for traceability.';

        const currentHash = this.calculateHash(introText);
        if (this.state.introMessageHash === currentHash && this.state.introMessageId) {
            return;
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && (msg.content.includes('Welcome to #bot') || msg.embeds[0]?.title?.includes('bot'))) {
                    existingPinned = msg;
                    break;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('🤖 Welcome to #bot‑commands!')
                .setColor(0x3B82F6)
                .setDescription(
                    'This channel is your interactive command console for Wnode automation.\n' +
                    'Use the commands below to query documentation, operator status, telemetry, and system metrics.\n\n' +
                    '**Available Commands:**\n' +
                    '• `!docs [topic]` — Fetch documentation from `/docs/INDEX.md` or category subfolders.\n' +
                    '• `!search [keyword]` — Search across all indexed documentation.\n' +
                    '• `!operator [status|config|logs]` — Query Node Operator telemetry and configuration.\n' +
                    '• `!dewi [pulse|mesh|network]` — Retrieve DePIN and sovereign compute metrics.\n' +
                    '• `!mesh [nodes|latency|peers]` — Display live mesh topology and peer health.\n' +
                    '• `!status` — Show system uptime, version, and audit pulse summary.\n\n' +
                    '*All commands are logged to `/api/v1/system/pulse` for audit tracking.*'
                )
                .setFooter({ text: 'Wnode Sovereign Mesh • Interactive Command Console' })
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
            console.log('[BotCommandsConsoleEngine] ✅ Ensured #bot-commands console header is active and pinned.');
        } catch (err) {
            console.error('[BotCommandsConsoleEngine] Failed to ensure console header:', err);
        }
    }

    // 2. Command Category References
    public getCategoryReferences(): CommandCategoryReference[] {
        return [
            {
                group: 'Documentation Commands',
                icon: '📖',
                commands: [
                    { syntax: '!docs [topic]', description: 'Fetch documentation from /docs/INDEX.md or category subfolders', example: '!docs 04-node-operator' },
                    { syntax: '!search [keyword]', description: 'Search across all indexed documentation', example: '!search zero-storage' }
                ]
            },
            {
                group: 'Operator Commands',
                icon: '🛠',
                commands: [
                    { syntax: '!operator [status|config|logs]', description: 'Query Node Operator telemetry and configuration', example: '!operator status' },
                    { syntax: '!status', description: 'Show system uptime, version, and audit pulse summary', example: '!status' }
                ]
            },
            {
                group: 'Telemetry Commands',
                icon: '🌐',
                commands: [
                    { syntax: '!dewi [pulse|mesh|network]', description: 'Retrieve DePIN and sovereign compute metrics', example: '!dewi pulse' },
                    { syntax: '!mesh [nodes|latency|peers]', description: 'Display live mesh topology and peer health', example: '!mesh nodes' }
                ]
            }
        ];
    }

    // 3. Build & Ensure Category References Pinned
    public async ensureCategoryReferences(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'bot-commands' || c.id === '1540912039537410071');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'bot-commands' || c?.id === '1540912039537410071');
        }
        if (!channel) return;

        const refs = this.getCategoryReferences();
        if (!this.state.categoryPinIds) this.state.categoryPinIds = {};

        for (const ref of refs) {
            const refHash = this.calculateHash(JSON.stringify(ref));
            if (this.state.categoryPinIds[ref.group]) continue;

            const fields = ref.commands.map(cmd => ({
                name: `\`${cmd.syntax}\``,
                value: `${cmd.description}\n*Example:* \`${cmd.example}\``,
                inline: false
            }));

            const embed = new EmbedBuilder()
                .setTitle(`${ref.icon} Command Console Reference — ${ref.group}`)
                .setColor(0x3B82F6)
                .setDescription(`Interactive syntax and reference for **${ref.group}**:`)
                .addFields(fields)
                .setFooter({ text: 'Wnode Sovereign Mesh • Command Console Reference' })
                .setTimestamp();

            const message = await channel.send({ embeds: [embed] });
            this.state.categoryPinIds[ref.group] = message.id;
            console.log(`[BotCommandsConsoleEngine] ✅ Published reference embed for ${ref.group}`);
        }

        this.saveState();
    }

    // 4. Audit Pulse Event Log
    public async logCommandAudit(command: string, username: string): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'command_executed',
                    command,
                    user: username,
                    timestamp: new Date().toISOString(),
                    source: 'discord_bot_commands'
                })
            });
        } catch (err) {
            console.error('[BotCommandsConsoleEngine] Failed to log command audit:', err);
        }
    }
}
