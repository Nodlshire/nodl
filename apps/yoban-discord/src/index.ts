import { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    Events, 
    ActivityType,
    Message,
    Interaction,
    SlashCommandSubcommandBuilder,
    SlashCommandStringOption
} from 'discord.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { YobanRAG } from './rag';
import { formatYobanResponse } from './personality';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../tools/discord-bot/.env') });

const token = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1540876857790963772';
const guildId = process.env.GUILD_ID || '1496144706776600697';

if (!token) {
    console.error('[YobanDiscord] ❌ DISCORD_TOKEN is missing from environment variables.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message]
});

const rag = new YobanRAG();

// Register Slash Commands
const commands = [
    new SlashCommandBuilder()
        .setName('yoban')
        .setDescription('Interact with Yoban — Wnode Enterprise AI Assistant')
        .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
            sub.setName('ask')
               .setDescription('Ask Yoban any technical or protocol question')
               .addStringOption((opt: SlashCommandStringOption) => opt.setName('query').setDescription('Your question').setRequired(true))
        )
        .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
            sub.setName('docs')
               .setDescription('Get links to Wnode documentation SOT')
        )
        .addSubcommand((sub: SlashCommandSubcommandBuilder) =>
            sub.setName('status')
               .setDescription('Check Yoban Chatbot system status')
        )
];

async function registerSlashCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(token!);
        console.log('[YobanDiscord] 🔄 Registering Slash Commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('[YobanDiscord] ✅ Slash commands successfully registered.');
    } catch (err) {
        console.error('[YobanDiscord] Failed to register slash commands:', err);
    }
}

client.once(Events.ClientReady, async (readyClient: Client) => {
    console.log(`[YobanDiscord] 🤖 Logged in as ${readyClient.user?.tag}`);
    readyClient.user?.setActivity('Wnode Documentation Canon (v1.5.0)', { type: ActivityType.Watching });
    await registerSlashCommands();
});

// Handle Messages (DMs and @mentions)
client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    const isDM = !message.guild;
    const isMentioned = message.mentions.has(client.user?.id || '');

    if (isDM || isMentioned) {
        const cleanText = message.content.replace(/<@!?\d+>/g, '').trim();
        console.log(`[YobanDiscord] Received ${isDM ? 'DM' : '@mention'} from ${message.author.tag}: "${cleanText}"`);
        
        try {
            const ragResult = rag.query(cleanText);
            const formatted = formatYobanResponse(cleanText, ragResult.answer, ragResult.sources, ragResult.confidenceScore);
            await message.reply(formatted);
        } catch (err) {
            console.error('[YobanDiscord] Error handling message:', err);
            await message.reply('🤖 **Yoban Assistant**: An internal error occurred while retrieving information. Please try again in a moment.');
        }
    }
});

// Handle Slash Commands
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'yoban') return;

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'ask') {
        const query = interaction.options.getString('query', true);
        await interaction.deferReply();
        const ragResult = rag.query(query);
        const formatted = formatYobanResponse(query, ragResult.answer, ragResult.sources, ragResult.confidenceScore);
        await interaction.editReply(formatted);
    } else if (subcommand === 'docs') {
        await interaction.reply({
            content: `🤖 **Yoban Assistant** — *Wnode Documentation Canon*\n\n• **Docs Portal**: https://wnode.one/docs\n• **Nodlr Dashboard**: https://nodlr.wnode.one\n• **Command Centre**: https://cmd.wnode.one`,
            ephemeral: true
        });
    } else if (subcommand === 'status') {
        await interaction.reply({
            content: `🤖 **Yoban Assistant**: Operational ✅\n• **Version**: \`v1.5.0-enterprise\`\n• **Uptime**: \`${Math.floor(process.uptime())}s\`\n• **RAG Pipeline**: Active`,
            ephemeral: true
        });
    }
});

client.login(token);
