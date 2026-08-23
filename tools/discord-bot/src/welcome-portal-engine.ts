import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ChannelType
} = require('discord.js');

export interface WelcomeRecord {
    userId: string;
    username: string;
    answers?: {
        osDevice?: string;
        terminalSSH?: string;
        interests?: string;
    };
    assignedRoles: string[];
    threadId?: string;
    joinedAt: string;
    updatedAt: string;
}

export interface WelcomeState {
    records: { [userId: string]: WelcomeRecord };
    pinnedMessageId?: string;
    pinnedMessageHash?: string;
    lastDailySummaryDate?: string;
}

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/welcome-registry.json');

export class WelcomePortalEngine {
    private state: WelcomeState = { records: {} };

    constructor() {
        this.loadRegistry();
    }

    private loadRegistry(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    this.state.records = {};
                    for (const r of parsed) {
                        this.state.records[r.userId] = r;
                    }
                } else {
                    this.state = parsed;
                }
            }
        } catch (err) {
            console.error('[WelcomePortalEngine] Failed to load registry:', err);
        }
    }

    private saveRegistry(): void {
        try {
            const dir = path.dirname(REGISTRY_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(this.state, null, 2), 'utf-8');
        } catch (err) {
            console.error('[WelcomePortalEngine] Failed to save registry:', err);
        }
    }

    public calculateHash(text: string): string {
        return crypto.createHash('sha256').update(text.trim()).digest('hex');
    }

    // 1. Build Main Welcome Embed
    public buildMainWelcomeEmbed(guild: any): { embeds: any[]; components: any[] } {
        const betaChannel = guild?.channels.cache.find((c: any) => c.name === 'beta-onboarding');
        const operatorChannel = guild?.channels.cache.find((c: any) => c.name === 'operator-guides');
        const contribChannel = guild?.channels.cache.find((c: any) => c.name === 'contributions');
        const releaseChannel = guild?.channels.cache.find((c: any) => c.name === 'release-notes');

        const embed = new EmbedBuilder()
            .setTitle('👋 Welcome to Wnode!')
            .setColor(0x3b82f6)
            .setDescription(
                'We’re excited to have you here. Tell us a bit about yourself — what brings you to Wnode? Are you testing, building, or exploring the mesh?'
            )
            .addFields([
                {
                    name: '🚀 Quick Navigation Portals',
                    value:
                        `🔹 **Become a Beta Tester** → ${betaChannel ? `<#${betaChannel.id}>` : '#beta-onboarding'}\n` +
                        `🔹 **Operator Guides** → ${operatorChannel ? `<#${operatorChannel.id}>` : '#operator-guides'}\n` +
                        `🔹 **Contributions** → ${contribChannel ? `<#${contribChannel.id}>` : '#contributions'}\n` +
                        `🔹 **Release Notes** → ${releaseChannel ? `<#${releaseChannel.id}>` : '#release-notes'}`,
                    inline: false
                },
                {
                    name: '⚡ Interactive Onboarding Check',
                    value: 'New here? Click **Start Onboarding Check** below to customize your roles and receive step-by-step setup guides!',
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • Interactive Welcome Portal' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('start_welcome_onboarding')
                .setLabel('🚀 Start Onboarding Check')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('nav_beta_onboarding')
                .setLabel('🔹 Become a Beta Tester')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nav_operator_guides')
                .setLabel('🔹 Operator Guides')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nav_contributions')
                .setLabel('🔹 Contributions')
                .setStyle(ButtonStyle.Secondary)
        );

        return { embeds: [embed], components: [row] };
    }

    // Ensure Main Welcome Embed is Pinned & Auto-Updated
    public async ensureMainWelcomePinned(guild: any): Promise<void> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'welcome');
        if (!channel) return;

        const payload = this.buildMainWelcomeEmbed(guild);
        const contentStr = JSON.stringify(payload.embeds[0].data);
        const currentHash = this.calculateHash(contentStr);

        if (this.state.pinnedMessageHash === currentHash && this.state.pinnedMessageId) {
            return; // Anti-noise rule: silent update / noop
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned();
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && msg.embeds[0]?.title?.includes('Welcome to Wnode')) {
                    existingPinned = msg;
                    break;
                }
            }

            if (existingPinned) {
                await existingPinned.edit(payload);
                this.state.pinnedMessageId = existingPinned.id;
            } else {
                const message = await channel.send(payload);
                await message.pin().catch(() => {});
                this.state.pinnedMessageId = message.id;
            }

            this.state.pinnedMessageHash = currentHash;
            this.saveRegistry();
        } catch (err) {
            console.error('[WelcomePortalEngine] Failed to pin main welcome embed:', err);
        }
    }

    // 2. Interactive Onboarding Thread for New Member
    public async handleNewMember(member: any): Promise<void> {
        const userId = member.id;
        const username = member.user.tag;

        if (this.state.records[userId]?.threadId) {
            return; // Anti-noise rule: only 1 welcome thread per user
        }

        const channel = member.guild.channels.cache.find((c: any) => c.name === 'welcome');
        if (!channel) return;

        // Log initial join
        const record: WelcomeRecord = {
            userId,
            username,
            assignedRoles: ['Community'],
            joinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.state.records[userId] = record;

        try {
            const threadName = `welcome-${member.user.username}`.toLowerCase().replace(/[^a-z0-9_-]/g, '');
            const thread = await channel.threads.create({
                name: threadName || `welcome-${member.id}`,
                autoArchiveDuration: 1440,
                type: ChannelType.PrivateThread,
                reason: 'Wnode Interactive Onboarding Thread'
            }).catch(async () => {
                return await channel.threads.create({
                    name: threadName || `welcome-${member.id}`,
                    autoArchiveDuration: 1440,
                    reason: 'Wnode Interactive Onboarding Thread'
                });
            });

            record.threadId = thread.id;
            this.saveRegistry();

            const threadEmbed = new EmbedBuilder()
                .setTitle(`👋 Welcome to Wnode, ${member.displayName}!`)
                .setColor(0x3b82f6)
                .setDescription(
                    'To help us personalize your experience and assign your network roles, please complete this quick 3-question onboarding check:\n\n' +
                    '**1.** What OS or device will you use to run `nodld`? *(Linux, macOS, Windows WSL2, RPi)*\n' +
                    '**2.** Are you familiar with terminal or SSH? *(Experienced, Learning, Beginner)*\n' +
                    '**3.** What interests you most about the mesh? *(Beta Testing, Running Nodes, Contributing Code, Exploring DeWi)*'
                )
                .setFooter({ text: 'Click below to submit your answers and unlock your roles.' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`submit_onboarding_answers_${userId}`)
                    .setLabel('✏️ Answer Onboarding Check')
                    .setStyle(ButtonStyle.Primary)
            );

            await thread.send({ content: `<@${userId}>`, embeds: [threadEmbed], components: [row] });
        } catch (err) {
            console.error('[WelcomePortalEngine] Failed to create welcome thread for member:', err);
        }
    }

    // Modal Builder for Interactive Onboarding
    public createOnboardingModal(userId: string): any {
        const modal = new ModalBuilder()
            .setCustomId(`modal_welcome_answers_${userId}`)
            .setTitle('Wnode Personalized Onboarding Check');

        const q1 = new TextInputBuilder()
            .setCustomId('q1_os_device')
            .setLabel('1. What OS/device will you use for nodld?')
            .setPlaceholder('e.g. Ubuntu 22.04 LTS, macOS, Windows WSL2, Raspberry Pi 4')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const q2 = new TextInputBuilder()
            .setCustomId('q2_terminal_ssh')
            .setLabel('2. Familiar with terminal or SSH?')
            .setPlaceholder('e.g. Experienced / Learning / Beginner')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const q3 = new TextInputBuilder()
            .setCustomId('q3_interests')
            .setLabel('3. What interests you most about Wnode?')
            .setPlaceholder('e.g. Beta Testing, Running Nodes, Contributing, DeWi')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(q1),
            new ActionRowBuilder().addComponents(q2),
            new ActionRowBuilder().addComponents(q3)
        );

        return modal;
    }

    // Handle Onboarding Answers & Role Assignment
    public async handleModalSubmission(interaction: any): Promise<void> {
        const userId = interaction.user.id;
        const osDevice = interaction.fields.getTextInputValue('q1_os_device');
        const terminalSSH = interaction.fields.getTextInputValue('q2_terminal_ssh');
        const interests = interaction.fields.getTextInputValue('q3_interests');

        const record = this.state.records[userId] || {
            userId,
            username: interaction.user.tag,
            assignedRoles: ['Community'],
            joinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        record.answers = { osDevice, terminalSSH, interests };
        record.updatedAt = new Date().toISOString();

        const assignedRoles: string[] = ['Community'];
        const member = interaction.member;
        const guild = interaction.guild;

        if (guild && member) {
            const lowerInterests = interests.toLowerCase();
            const lowerTerminal = terminalSSH.toLowerCase();

            if (lowerInterests.includes('beta') || lowerInterests.includes('test')) {
                assignedRoles.push('Beta Tester');
                const role = guild.roles.cache.find((r: any) => r.name === 'Beta Tester');
                if (role) await member.roles.add(role).catch(() => {});
            }

            if (lowerTerminal.includes('exp') || lowerTerminal.includes('pro') || lowerTerminal.includes('yes') || lowerInterests.includes('node') || lowerInterests.includes('run')) {
                assignedRoles.push('Operator Pro');
                const role = guild.roles.cache.find((r: any) => r.name === 'Operator Pro') || guild.roles.cache.find((r: any) => r.name === 'Node Operator');
                if (role) await member.roles.add(role).catch(() => {});
            }

            if (lowerInterests.includes('contrib') || lowerInterests.includes('code') || lowerInterests.includes('dev') || lowerInterests.includes('build')) {
                assignedRoles.push('Contributor');
                const role = guild.roles.cache.find((r: any) => r.name === 'Contributor');
                if (role) await member.roles.add(role).catch(() => {});
            }
        }

        record.assignedRoles = Array.from(new Set(assignedRoles));
        this.state.records[userId] = record;
        this.saveRegistry();

        const rolesList = record.assignedRoles.map(r => `\`${r}\``).join(' ');
        await interaction.reply({
            content: `🎉 **Onboarding Complete!** Your network profile has been configured and assigned roles: ${rolesList}.\n\nCheck out <#${guild?.channels?.cache?.find((c: any) => c.name === 'beta-onboarding')?.id}> or <#${guild?.channels?.cache?.find((c: any) => c.name === 'getting-started')?.id}> to deploy your first node!`,
            ephemeral: true
        });
    }

    // 4. Daily New Members Summary Post
    public async postDailyMembersSummary(guild: any): Promise<boolean> {
        const today = new Date().toISOString().split('T')[0];
        if (this.state.lastDailySummaryDate === today) {
            return false;
        }

        const channel = guild.channels.cache.find((c: any) => c.name === 'welcome') || guild.channels.cache.find((c: any) => c.name === 'introductions');
        if (!channel) return false;

        const nowMs = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        const recentArrivals = Object.values(this.state.records).filter(r => {
            const joinedMs = new Date(r.joinedAt).getTime();
            return nowMs - joinedMs <= oneDayMs;
        });

        if (recentArrivals.length === 0) {
            return false;
        }

        const summaryLines = recentArrivals.map(r => {
            const rolesStr = r.assignedRoles.map(role => `\`${role}\``).join(' ');
            return `• **${r.username}** — Roles: ${rolesStr}`;
        });

        const embed = new EmbedBuilder()
            .setTitle('🎉 Daily New Members Summary')
            .setColor(0x3b82f6)
            .setDescription(`Welcome to all new members who joined the Wnode Mesh community today!`)
            .addFields([
                {
                    name: `👥 New Arrivals (${recentArrivals.length})`,
                    value: summaryLines.join('\n').slice(0, 1024),
                    inline: false
                },
                {
                    name: '💬 Say Hello!',
                    value: 'Jump into <#general> or <#introductions> to share your hardware setup and connect with fellow node operators!',
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • Community Onboarding' })
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        this.state.lastDailySummaryDate = today;
        this.saveRegistry();
        return true;
    }
}
