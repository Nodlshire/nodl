import 'dotenv/config';
import path from 'path';
import { DocsIndexer } from './docs-indexer';
import { CommandDispatcher, CommandResponse } from './commands';
import { ServerBuilder } from './server-builder';
import { BetaOnboardingManager } from './beta-onboarding';
import { EngagementEngine } from './engagement-engine';
import { FeedbackEngine } from './feedback-engine';
import { AnnouncementCadenceEngine } from './announcement-cadence';
import { ReleaseNotesEngine } from './release-notes-engine';
import { WelcomePortalEngine } from './welcome-portal-engine';
import { OperatorGuidesEngine } from './operator-guides-engine';
import { ApiDocsEngine } from './api-docs-engine';

// Require discord.js dynamically
const { Client, GatewayIntentBits, EmbedBuilder, Events } = require('discord.js');

const TOKEN = (process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN || process.env.BOT_TOKEN || '').trim();
const GUILD_ID = (process.env.GUILD_ID || '1496144706776600697').trim();
const DOCS_PATH = process.env.DOCS_PATH || path.resolve(__dirname, '../../../docs');
const STATUS_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds
const PROTOCOL_VERSION = 'v1.0.0';

export class WnodeDiscordBot {
    private client: any;
    private indexer: DocsIndexer;
    private dispatcher: CommandDispatcher;
    private serverBuilder: ServerBuilder;
    private betaManager: BetaOnboardingManager;
    private engagementEngine: EngagementEngine;
    private feedbackEngine: FeedbackEngine;
    private cadenceEngine: AnnouncementCadenceEngine;
    private releaseEngine: ReleaseNotesEngine;
    private welcomeEngine: WelcomePortalEngine;
    private guidesEngine: OperatorGuidesEngine;
    private apiDocsEngine: ApiDocsEngine;
    private statusInterval: any = null;

    constructor(docsPath: string) {
        this.indexer = new DocsIndexer(docsPath);
        this.dispatcher = new CommandDispatcher(this.indexer);
        this.serverBuilder = new ServerBuilder();
        this.betaManager = new BetaOnboardingManager();
        this.engagementEngine = new EngagementEngine();
        this.feedbackEngine = new FeedbackEngine();
        this.cadenceEngine = new AnnouncementCadenceEngine();
        this.releaseEngine = new ReleaseNotesEngine();
        this.welcomeEngine = new WelcomePortalEngine();
        this.guidesEngine = new OperatorGuidesEngine();
        this.apiDocsEngine = new ApiDocsEngine();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions
            ]
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        // Client Ready Event (Successful Discord Gateway Handshake)
        this.client.once(Events.ClientReady, async (c: any) => {
            console.log(`[Wnode Discord Bot] ✅ Logged in to Discord Gateway as ${c.user.tag}! (ID: ${c.user.id})`);
            
            const boundGuild = c.guilds.cache.get(GUILD_ID) || c.guilds.cache.first();
            if (boundGuild) {
                console.log(`[Wnode Discord Bot] 🎯 Successfully bound to target Guild: "${boundGuild.name}" (ID: ${boundGuild.id})`);
                
                // Automatically execute full ServerBuilder category, channel, role & slash command rebuild
                try {
                    await this.serverBuilder.provisionGuild(boundGuild);
                } catch (err: any) {
                    console.error(`[Wnode Discord Bot] Error during automated guild provisioning:`, err.message || err);
                }

                // Initial status update, release notes, pinned welcome portal, operator guides & api docs check
                await this.updatePinnedStatusTelemetry(boundGuild);
                await this.releaseEngine.processAndPostReleases(boundGuild);
                await this.welcomeEngine.ensureMainWelcomePinned(boundGuild);
                await this.guidesEngine.processAndPostGuides(boundGuild);
                await this.apiDocsEngine.processAndPostApiDocs(boundGuild);

                // Schedule recurring 10-minute status telemetry update & Sunday digest check
                if (this.statusInterval) clearInterval(this.statusInterval);
                this.statusInterval = setInterval(async () => {
                    this.updatePinnedStatusTelemetry(boundGuild);
                    await this.releaseEngine.processAndPostReleases(boundGuild);
                    await this.welcomeEngine.postDailyMembersSummary(boundGuild);
                    await this.guidesEngine.processAndPostGuides(boundGuild);
                    await this.apiDocsEngine.processAndPostApiDocs(boundGuild);

                    // If Sunday, post Sunday summary & release digest
                    const today = new Date();
                    if (today.getDay() === 0) {
                        this.cadenceEngine.postWeeklySundaySummary(boundGuild);
                        await this.releaseEngine.checkAndPostWeeklyDigest(boundGuild);
                    }
                }, STATUS_UPDATE_INTERVAL);
                console.log(`[Wnode Discord Bot] ⏰ Scheduled 10-minute telemetry, release notes, operator guides, API docs & Sunday digest updater.`);
            } else {
                console.log(`[Wnode Discord Bot] ℹ️ Serving ${c.guilds.cache.size} guild(s). Target GUILD_ID: ${GUILD_ID}`);
            }
        });

        // Debug & Error Handlers
        this.client.on(Events.Error, (err: any) => {
            console.error('[Wnode Discord Bot] ❌ Discord WebSocket Client Error:', err);
        });

        this.client.on(Events.Warn, (info: any) => {
            console.warn('[Wnode Discord Bot] ⚠️ Discord Client Warning:', info);
        });

        this.client.on(Events.ShardDisconnect, (event: any, id: any) => {
            console.warn(`[Wnode Discord Bot] 🔌 Shard ${id} disconnected from Gateway (code: ${event.code})`);
        });

        this.client.on(Events.ShardReconnecting, (id: any) => {
            console.log(`[Wnode Discord Bot] 🔄 Shard ${id} reconnecting to Gateway...`);
        });

        // Auto-Role Assignment & Welcome Flow for New Guild Members
        this.client.on(Events.GuildMemberAdd, async (member: any) => {
            try {
                if (GUILD_ID && member.guild.id !== GUILD_ID) return;

                // 1. Assign Community Role
                const communityRole = member.guild.roles.cache.find((r: any) => r.name === 'Community');
                if (communityRole) {
                    await member.roles.add(communityRole);
                    console.log(`[Wnode Discord Bot] Assigned 'Community' role to ${member.user.tag}`);
                }

                // 2. Trigger Welcome Portal Interactive Thread
                await this.welcomeEngine.handleNewMember(member);
            } catch (err) {
                console.error('[Wnode Discord Bot] Failed to execute welcome flow:', err);
            }
        });

        // Interactive Component & Modal Handler (Onboarding Button & Eligibility Check)
        this.client.on(Events.InteractionCreate, async (interaction: any) => {
            try {
                // Welcome Portal Onboarding Check Button
                if (interaction.isButton() && (interaction.customId === 'start_welcome_onboarding' || interaction.customId.startsWith('submit_onboarding_answers_'))) {
                    const modal = this.welcomeEngine.createOnboardingModal(interaction.user.id);
                    await interaction.showModal(modal);
                    return;
                }

                // Welcome Portal Modal Submit
                if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_welcome_answers_')) {
                    await this.welcomeEngine.handleModalSubmission(interaction);
                    return;
                }

                // Welcome Navigation Portal Buttons
                if (interaction.isButton() && interaction.customId.startsWith('nav_')) {
                    const targetName = interaction.customId.replace('nav_', '').replace(/_/g, '-');
                    const targetChannel = interaction.guild?.channels.cache.find((c: any) => c.name === targetName);
                    if (targetChannel) {
                        await interaction.reply({ content: `🚀 Navigate to portal: <#${targetChannel.id}>`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: `🚀 Explore channel: #${targetName}`, ephemeral: true });
                    }
                    return;
                }

                // 1. Button Click: Start Beta Onboarding
                if (interaction.isButton() && interaction.customId === 'start_beta_onboarding') {
                    const modal = BetaOnboardingManager.createEligibilityModal();
                    await interaction.showModal(modal);
                    return;
                }

                // 2. Modal Submit: Eligibility Check Processing
                if (interaction.isModalSubmit() && interaction.customId === 'beta_eligibility_modal') {
                    const osDevice = interaction.fields.getTextInputValue('q_os_device');
                    const terminalAccessStr = interaction.fields.getTextInputValue('q_terminal_access').toLowerCase();
                    const readyStr = interaction.fields.getTextInputValue('q_ram_dewi_ready').toLowerCase();

                    const isTerminalReady = terminalAccessStr.includes('yes') || terminalAccessStr.includes('y');
                    const isRamReady = readyStr.includes('yes') || readyStr.includes('y');

                    const isEligible = isTerminalReady || isRamReady;

                    if (isEligible) {
                        // Assign Beta Tester Role
                        const member = interaction.member;
                        const betaRole = interaction.guild?.roles.cache.find((r: any) => r.name === 'Beta Tester');
                        if (betaRole && member) {
                            await member.roles.add(betaRole);
                        }

                        // Update Registry State
                        this.betaManager.updateStage(interaction.user.id, 'guide_delivered', osDevice, isTerminalReady);

                        const guideEmbed = BetaOnboardingManager.createQuickStartGuideEmbed(interaction.user.username);
                        const setupEmbed = BetaOnboardingManager.createOperatorSetupPrompt();
                        const hooksEmbed = BetaOnboardingManager.createEngagementHooksEmbed();

                        // Deliver in DM
                        try {
                            await interaction.user.send({ embeds: [guideEmbed, setupEmbed, hooksEmbed] });
                            console.log(`[Wnode Discord Bot] 📬 Delivered Quick-Start Beta Guide in DM to ${interaction.user.tag}`);
                        } catch (dmErr) {
                            console.warn(`[Wnode Discord Bot] Could not send DM to ${interaction.user.tag}:`, dmErr);
                        }

                        // Post in #beta-onboarding
                        const onboardingChannel = interaction.guild?.channels.cache.find((c: any) => c.name === 'beta-onboarding');
                        if (onboardingChannel) {
                            await onboardingChannel.send({
                                content: `🎉 Welcome <@${interaction.user.id}> to the Wnode Public Beta Program!`,
                                embeds: [guideEmbed, setupEmbed, hooksEmbed]
                            });
                        }

                        await interaction.reply({
                            content: `🎉 **Eligibility Confirmed!** You have been granted the **Beta Tester** role.\nCheck your DMs and <#${onboardingChannel?.id || ''}> for your Quick-Start Guide!`,
                            ephemeral: true
                        });
                    } else {
                        // Not Eligible Guidance
                        await interaction.reply({
                            content: `⚠️ **Beta Program Qualification Guidance**\n\nTo qualify for the Wnode Beta Program, you need an SSH terminal or WSL2 on Windows.\nVisit <#help> or read [wnode.one/docs/04-node-operator](https://wnode.one/docs/04-node-operator/getting-started) to set up your environment!`,
                            ephemeral: true
                        });
                    }
                }
            } catch (err: any) {
                console.error('[Wnode Discord Bot] Error handling interaction:', err.message || err);
            }
        });

        // Message Listener for Mandatory Commands & Secure Feedback Loop Processing
        this.client.on(Events.MessageCreate, async (message: any) => {
            if (message.author.bot) return;

            const channelName = message.channel.name;

            // 1. Role-Gated & Rate-Limited Feedback Channels (#beta-feedback, #beta-bugs)
            if (channelName === 'beta-feedback' || channelName === 'beta-bugs') {
                if (!FeedbackEngine.hasRequiredRole(message.member)) {
                    console.warn(`[FeedbackEngine] Blocked un-roled feedback from ${message.author.tag} in #${channelName}`);
                    try { await message.delete(); } catch (e) {}
                    return;
                }

                const check = this.feedbackEngine.checkRateLimitAndSpam(message.author.id, channelName, message.content);
                if (!check.allowed) {
                    console.warn(`[FeedbackEngine] Rate limit / anti-spam block for ${message.author.tag}: ${check.reason}`);
                    try {
                        await message.delete();
                        const warningMsg = await message.channel.send({ content: `⚠️ <@${message.author.id}> ${check.reason}` });
                        setTimeout(() => warningMsg.delete().catch(() => {}), 8000);
                    } catch (e) {}
                    return;
                }

                const { record, isVerified } = this.feedbackEngine.processFeedback(message.author.id, message.author.username, channelName, message.content);
                
                // Add endorsement reaction
                try { await message.react('👍'); } catch (e) {}

                if (isVerified && message.guild) {
                    // Post Major Announcement for Telemetry-Verified Issue
                    await this.cadenceEngine.postMajorAnnouncement(
                        message.guild,
                        `Verified Issue Resolved: Telemetry Alert`,
                        'Verified Bug Milestone',
                        `Telemetry confirmed bug reported by <@${message.author.id}> in #${channelName}. Fix integrated in engine state.`,
                        [{ name: 'Report ID', value: `\`${record.id}\``, inline: true }]
                    );
                }
                return;
            }

            // 2. Command Dispatcher Listener
            const content = message.content.trim();
            if (!content.startsWith('!')) return;

            const parts = content.split(/\s+/);
            const command = parts[0];
            const args = parts.slice(1);

            console.log(`[Wnode Discord Bot] Received command "${command}" from ${message.author.tag} in #${message.channel.name || message.channelId}`);

            // If manual !nodes command invoked, trigger update in #status immediately
            if (command.toLowerCase() === '!nodes' && message.guild) {
                await this.updatePinnedStatusTelemetry(message.guild);
                if (message.channel.name !== 'status') {
                    await message.reply({ content: '⚡ Live node telemetry status updated & pinned in `#status`.' });
                }
                return;
            }

            const response: CommandResponse = this.dispatcher.handleCommand(command, args, message.author.username);

            // Handle reward role assignment for !challenge complete
            if (command.toLowerCase() === '!challenge' && args.length > 0 && args[0].toLowerCase() === 'complete' && message.member) {
                const pioneerRole = message.guild.roles.cache.find((r: any) => r.name === 'Mesh Pioneer');
                if (pioneerRole) {
                    await message.member.roles.add(pioneerRole);
                    console.log(`[Wnode Discord Bot] 🎖 Assigned 'Mesh Pioneer' role to ${message.author.tag}`);
                }
            }

            // Handle reward role assignment for !spotlight
            if (command.toLowerCase() === '!spotlight' && message.member) {
                const spotlightRole = message.guild.roles.cache.find((r: any) => r.name === 'Operator Spotlight');
                if (spotlightRole) {
                    await message.member.roles.add(spotlightRole);
                    console.log(`[Wnode Discord Bot] 🌟 Assigned 'Operator Spotlight' role to ${message.author.tag}`);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(response.embedTitle)
                .setColor(response.embedColor)
                .setDescription(response.description)
                .setTimestamp();

            if (response.url) {
                embed.setURL(response.url);
            }

            if (response.fields && response.fields.length > 0) {
                embed.addFields(response.fields);
            }

            try {
                await message.reply({ embeds: [embed] });
            } catch (err) {
                console.error('[Wnode Discord Bot] Failed to send reply embed:', err);
            }
        });
    }

    private async updatePinnedStatusTelemetry(guild: any): Promise<void> {
        try {
            const statusChannel = guild.channels.cache.find((c: any) => c.name === 'status');
            if (!statusChannel) {
                console.warn('[Wnode Discord Bot] Could not find #status channel in guild.');
                return;
            }

            const response: CommandResponse = this.dispatcher.handleCommand('!nodes', []);

            const embed = new EmbedBuilder()
                .setTitle(response.embedTitle)
                .setColor(response.embedColor)
                .setDescription(response.description)
                .setTimestamp();

            if (response.url) {
                embed.setURL(response.url);
            }

            if (response.fields && response.fields.length > 0) {
                embed.addFields(response.fields);
            }

            // Fetch pinned messages in #status channel cleanly
            let pinnedMessages: any;
            if (statusChannel.messages.fetchPins) {
                pinnedMessages = await statusChannel.messages.fetchPins();
            } else if (statusChannel.messages.fetchPinned) {
                pinnedMessages = await statusChannel.messages.fetchPinned();
            } else {
                pinnedMessages = await statusChannel.messages.fetch({ pinned: true });
            }

            const pinnedArray = Array.isArray(pinnedMessages) ? pinnedMessages : Array.from(pinnedMessages.values ? pinnedMessages.values() : []);
            const botPinnedMessage = pinnedArray.find((m: any) => m.author && m.author.id === this.client.user.id);

            if (botPinnedMessage) {
                await botPinnedMessage.edit({ embeds: [embed] });
                console.log(`[Wnode Discord Bot] 📌 Updated pinned status telemetry message in #${statusChannel.name}`);
            } else {
                const newMsg = await statusChannel.send({ embeds: [embed] });
                await newMsg.pin();
                console.log(`[Wnode Discord Bot] 📌 Created and pinned new status telemetry message in #${statusChannel.name}`);
            }
        } catch (err: any) {
            console.error('[Wnode Discord Bot] Failed to update pinned status telemetry:', err.message || err);
        }
    }

    private async handleDocsChangeEvent(changedFile: string, changeType: 'add' | 'change' | 'unlink'): Promise<void> {
        console.log(`[Wnode Discord Bot] [SOT Event] ${changeType.toUpperCase()}: ${changedFile}`);

        try {
            const guild = this.client.guilds.cache.get(GUILD_ID) || this.client.guilds.cache.first();
            if (!guild) return;

            const article = this.indexer.getArticleBySlug(changedFile);

            // 1. Audit Log to #bot-log (All events)
            const botLogChannel = guild.channels.cache.find((c: any) => c.name === 'bot-log');
            if (botLogChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('⚙️ SOT Documentation Reindexed')
                    .setColor(0x3b82f6)
                    .setDescription(`File \`${changedFile}\` was **${changeType}d**. In-memory SOT index refreshed.`)
                    .setTimestamp();
                await botLogChannel.send({ embeds: [logEmbed] });
            }

            // 2. Broadcast minor doc edits to #docs-changelog & #operator-guides (Silent, non-intrusive)
            const changelogChannel = guild.channels.cache.find((c: any) => c.name === 'docs-changelog');
            if (changelogChannel) {
                const changeEmbed = new EmbedBuilder()
                    .setTitle(`📝 SOT Canon Update: ${article?.title || changedFile}`)
                    .setColor(0x10b981)
                    .setDescription(`Authoritative page \`${changedFile}\` was updated in the SOT canon.\n[View Updated Page](${article?.url || 'https://wnode.one/docs'})`)
                    .addFields([
                        { name: 'Protocol Version', value: PROTOCOL_VERSION, inline: true },
                        { name: 'Update Type', value: changeType.toUpperCase(), inline: true }
                    ])
                    .setTimestamp();
                await changelogChannel.send({ embeds: [changeEmbed] });
            }

            // 3. Cadence Engine for #announcements (MAJOR UPDATES ONLY)
            const isMajorOverview = changedFile.includes('00-overview') || changedFile.includes('01-architecture');
            const isMajorGovernance = changedFile.includes('06-economics-governance');
            const isProtocolRelease = changedFile.includes('RELEASE_NOTES') || changedFile.includes('version');

            if (isMajorOverview || isMajorGovernance || isProtocolRelease) {
                const updateCategory = isMajorGovernance ? 'Soul-DAO Governance Amendment' : (isProtocolRelease ? 'Protocol Release Milestone' : 'Core Architecture Milestone');

                await this.cadenceEngine.postMajorAnnouncement(
                    guild,
                    `Major Protocol Specification Update`,
                    updateCategory,
                    `An authoritative **${updateCategory}** has been published to the Wnode Sovereign Canon.`,
                    [
                        { name: '📄 Updated Document', value: `\`${changedFile}\` (${article?.title || 'Protocol Specification'})`, inline: false }
                    ],
                    article?.url || 'https://wnode.one/docs'
                );
            }
        } catch (err) {
            console.error('[Wnode Discord Bot] Error in announcement cadence automation:', err);
        }
    }

    public async start(): Promise<void> {
        console.log(`[Wnode Discord Bot] Starting service...`);
        console.log(`[Wnode Discord Bot] Target Guild ID: ${GUILD_ID}`);
        console.log(`[Wnode Discord Bot] Serving SOT documentation from: ${DOCS_PATH}`);

        // Start filesystem watcher for /docs/**
        this.indexer.startWatcher((changedFile: string, changeType: 'add' | 'change' | 'unlink') => {
            this.handleDocsChangeEvent(changedFile, changeType);
        });

        if (!TOKEN) {
            console.error('[Wnode Discord Bot] ❌ DISCORD_BOT_TOKEN not set in environment or .env file!');
            console.log('[Wnode Discord Bot] SOT indexer running in standalone validation mode.');
            return;
        }

        console.log(`[Wnode Discord Bot] Token detected (${TOKEN.substring(0, 10)}...). Connecting to Discord Gateway API...`);
        
        try {
            await this.client.login(TOKEN);
        } catch (err: any) {
            console.error('[Wnode Discord Bot] ❌ Discord client login failed:', err.message || err);
        }
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
