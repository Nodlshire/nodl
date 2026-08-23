import path from 'path';
import { DocsIndexer } from './docs-indexer';
import { CommandDispatcher, CommandResponse } from './commands';

// Type definitions for Discord.js integration
export interface DiscordEmbed {
    title: string;
    color: number;
    description: string;
    url?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    timestamp: string;
}

export interface DiscordMessage {
    author: { bot: boolean; id: string; username: string };
    content: string;
    channelId: string;
    reply: (response: { embeds: DiscordEmbed[] }) => Promise<any>;
}

const TOKEN = process.env.DISCORD_TOKEN || '';
const DOCS_PATH = process.env.DOCS_PATH || path.resolve(__dirname, '../../../docs');

export class WnodeDiscordBot {
    private indexer: DocsIndexer;
    private dispatcher: CommandDispatcher;
    private isRunning: boolean = false;

    constructor(docsPath: string) {
        this.indexer = new DocsIndexer(docsPath);
        this.dispatcher = new CommandDispatcher(this.indexer);
    }

    public async start(): Promise<void> {
        console.log(`[Wnode Discord Bot] Starting service...`);
        console.log(`[Wnode Discord Bot] Serving SOT documentation from: ${DOCS_PATH}`);
        
        this.isRunning = true;

        // Initialize Auto-Update System watcher for /docs/**
        this.indexer.startWatcher((changedFile: string, changeType: 'add' | 'change' | 'unlink') => {
            this.handleDocsChangeEvent(changedFile, changeType);
        });

        if (!TOKEN) {
            console.log('[Wnode Discord Bot] DISCORD_TOKEN not set. SOT indexer running in standalone validation mode.');
        }
    }

    public handleDocsChangeEvent(changedFile: string, changeType: 'add' | 'change' | 'unlink'): void {
        console.log(`[Wnode Discord Bot] [SOT Event] ${changeType.toUpperCase()}: ${changedFile}`);
        console.log(`[Wnode Discord Bot] Reindexed /docs tree. Dispatching updates to #bot-log and #docs-changelog.`);
        
        if (changedFile.includes('00-overview') || changedFile.includes('01-architecture')) {
            console.log(`[Wnode Discord Bot] Major architectural update detected in ${changedFile}. Notifying #announcements.`);
        }
    }

    public async processMessage(message: DiscordMessage): Promise<DiscordEmbed | null> {
        if (message.author.bot) return null;

        const content = message.content.trim();
        if (!content.startsWith('!')) return null;

        const parts = content.split(/\s+/);
        const command = parts[0];
        const args = parts.slice(1);

        const response: CommandResponse = this.dispatcher.handleCommand(command, args);

        const embed: DiscordEmbed = {
            title: response.embedTitle,
            color: response.embedColor,
            description: response.description,
            url: response.url,
            fields: response.fields,
            timestamp: new Date().toISOString()
        };

        return embed;
    }

    public getIndexer(): DocsIndexer {
        return this.indexer;
    }
}

// Standalone execution entrypoint
if (require.main === module) {
    const bot = new WnodeDiscordBot(DOCS_PATH);
    bot.start().catch(console.error);
}
