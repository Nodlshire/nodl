import fs from 'fs';
import path from 'path';

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/beta-registry.json');

export interface BetaTesterRecord {
    userId: string;
    username: string;
    stage: 'joined' | 'role_assigned' | 'guide_delivered' | 'node_deployed';
    deviceOS: string;
    terminalAccess: boolean;
    joinedAt: string;
    updatedAt: string;
}

export class BetaOnboardingManager {
    private registry: Map<string, BetaTesterRecord> = new Map();

    constructor() {
        this.loadRegistry();
    }

    private loadRegistry(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                const data: BetaTesterRecord[] = JSON.parse(raw);
                for (const item of data) {
                    this.registry.set(item.userId, item);
                }
            }
        } catch (err) {
            console.error('[BetaOnboardingManager] Failed to load registry:', err);
        }
    }

    private saveRegistry(): void {
        try {
            const dir = path.dirname(REGISTRY_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const data = Array.from(this.registry.values());
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('[BetaOnboardingManager] Failed to save registry:', err);
        }
    }

    public recordUserJoin(userId: string, username: string): boolean {
        if (this.registry.has(userId)) {
            return false; // Already recorded
        }
        const record: BetaTesterRecord = {
            userId,
            username,
            stage: 'joined',
            deviceOS: 'Pending Check',
            terminalAccess: false,
            joinedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.registry.set(userId, record);
        this.saveRegistry();
        return true;
    }

    public updateStage(userId: string, stage: BetaTesterRecord['stage'], deviceOS?: string, terminalAccess?: boolean): void {
        const record = this.registry.get(userId);
        if (record) {
            record.stage = stage;
            record.updatedAt = new Date().toISOString();
            if (deviceOS) record.deviceOS = deviceOS;
            if (terminalAccess !== undefined) record.terminalAccess = terminalAccess;
            this.registry.set(userId, record);
            this.saveRegistry();
        }
    }

    public isUserOnboarded(userId: string): boolean {
        const record = this.registry.get(userId);
        return record ? (record.stage === 'guide_delivered' || record.stage === 'node_deployed') : false;
    }

    // 1. Welcome Message & Button
    public static createWelcomeMessage(member: any): { embeds: any[]; components: any[] } {
        const embed = new EmbedBuilder()
            .setTitle(`⚡ Welcome to Wnode Sovereign Compute Mesh, ${member.displayName}!`)
            .setColor(0x3b82f6)
            .setDescription(`You've just joined **Wnode** — the zero-storage, sovereign compute + DePIN/DeWi wireless mesh.\n\nTurn your PC, laptop, or server into an income-generating compute node in under 60 seconds!`)
            .addFields([
                { name: '🧪 Public Beta Program', value: 'Test zero-storage RAM execution, earn daily USD payouts, and route DeWi packet telemetry.', inline: false },
                { name: '⚡ Fast-Track Onboarding', value: 'Click the button below to complete the 3-question eligibility check and claim your **Beta Tester** access.', inline: false }
            ])
            .setFooter({ text: 'Wnode Sovereign Compute Mesh • Fast-Track Onboarding' })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('start_beta_onboarding')
                .setLabel('🚀 Start Beta Onboarding')
                .setStyle(ButtonStyle.Primary)
        );

        return { embeds: [embed], components: [row] };
    }

    // 2. Eligibility Modal
    public static createEligibilityModal(): any {
        const modal = new ModalBuilder()
            .setCustomId('beta_eligibility_modal')
            .setTitle('Wnode Beta Tester Eligibility Check');

        const osInput = new TextInputBuilder()
            .setCustomId('q_os_device')
            .setLabel('1. What OS/device will run nodld?')
            .setPlaceholder('e.g. Ubuntu 22.04 LTS, macOS, Windows WSL2, Raspberry Pi')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const terminalInput = new TextInputBuilder()
            .setCustomId('q_terminal_access')
            .setLabel('2. Do you have terminal/SSH access? (Yes/No)')
            .setPlaceholder('Yes / No')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const readyInput = new TextInputBuilder()
            .setCustomId('q_ram_dewi_ready')
            .setLabel('3. Ready to test RAM compute & DeWi? (Yes/No)')
            .setPlaceholder('Yes / No')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(osInput),
            new ActionRowBuilder().addComponents(terminalInput),
            new ActionRowBuilder().addComponents(readyInput)
        );

        return modal;
    }

    // 3. Quick-Start Beta Guide Embed
    public static createQuickStartGuideEmbed(username: string): any {
        return new EmbedBuilder()
            .setTitle('🚀 Wnode Beta Tester Quick-Start Guide')
            .setColor(0x10b981) // Emerald Green
            .setDescription(`Congratulations **${username}**! You have been granted **Beta Tester** access.\nFollow this 4-step checklist to deploy your node in under 60 seconds:`)
            .addFields([
                {
                    name: '1. Headless Linux / Terminal Setup',
                    value: 'Wnode runs natively on Linux (Ubuntu/Debian/Fedora), macOS, or Windows WSL2.',
                    inline: false
                },
                {
                    name: '2. One-Line Node Installer',
                    value: 'Execute the official binary installer in your terminal:\n```bash\ncurl -fsSL https://nodlr.wnode.one/install.sh | bash\n```',
                    inline: false
                },
                {
                    name: '3. Telemetry & Mesh Connection Verification',
                    value: 'Verify your zero-storage daemon status & mesh connectivity:\n```bash\n./nodld --status\n```',
                    inline: false
                },
                {
                    name: '4. First-Run Checklist',
                    value: '✅ Daemon running on port `:8080`\n✅ Connected to Stripe Daily USD Payouts\n✅ Zero disk storage consumed (100% ephemeral RAM fabric)',
                    inline: false
                }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • SOT Documentation' })
            .setTimestamp();
    }

    // 4. Operator Setup Prompt
    public static createOperatorSetupPrompt(): any {
        return new EmbedBuilder()
            .setTitle('🛠 Operator Setup Prompt — Deploy Your Node')
            .setColor(0x8b5cf6) // Purple
            .setDescription('Ready to deploy your first node? Copy and paste the command below:')
            .addFields([
                {
                    name: '⚡ Install Command',
                    value: '```bash\ncurl -fsSL https://nodlr.wnode.one/install.sh | bash\n```',
                    inline: false
                },
                {
                    name: '📖 Headless Operator Guides',
                    value: 'Need advanced configuration? Check out `#operator-guides` and [wnode.one/docs/04-node-operator](https://wnode.one/docs/04-node-operator/operator-guide)',
                    inline: false
                }
            ]);
    }

    // 5. Engagement Hooks
    public static createEngagementHooksEmbed(): any {
        return new EmbedBuilder()
            .setTitle('🎉 You are now an Active Wnode Beta Tester!')
            .setColor(0x06b6d4) // Cyan
            .setDescription('Jump into the community channels to share your node setup and provide feedback:')
            .addFields([
                { name: '💬 #beta-feedback', value: 'Share your performance metrics and feedback.', inline: true },
                { name: '🛠 #troubleshooting', value: 'Get instant peer support for daemon setups.', inline: true },
                { name: '📊 #status', value: 'View real-time mesh capacity & telemetry.', inline: true }
            ]);
    }

    // 6. Ensure Channel Intro & Quick-Start Guide Pins
    public async ensureBetaOnboardingIntro(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'beta-onboarding' || c.id === '1541332805122916453');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'beta-onboarding' || c?.id === '1541332805122916453');
        }
        if (!channel) return;

        const introText =
            '🚀 **Welcome to #beta‑onboarding!**\n' +
            'We’re thrilled to have you join the Wnode Public Beta program!\n' +
            'This channel will guide you through setup, telemetry activation, and node configuration so you can start testing right away.\n\n' +
            '**Here’s what you’ll find:**\n' +
            '• Step‑by‑step onboarding instructions.\n' +
            '• Quick‑Start Beta Guide for your platform.\n' +
            '• Help with telemetry activation and node setup.\n' +
            '• Friendly support from moderators and fellow testers.\n\n' +
            'If you’re new, start with the pinned **Quick‑Start Guide** below.';

        const guideText =
            '🚀 **Wnode Beta Tester Quick-Start Guide**\n' +
            'Follow this 4-step checklist to deploy your node in under 60 seconds:\n\n' +
            '**1. Headless Linux / Terminal Setup**\n' +
            'Wnode runs natively on Linux (Ubuntu/Debian/Fedora), macOS, or Windows WSL2.\n\n' +
            '**2. One-Line Node Installer**\n' +
            'Execute the official binary installer in your terminal:\n' +
            '```bash\ncurl -fsSL https://nodlr.wnode.one/install.sh | bash\n```\n\n' +
            '**3. Telemetry & Mesh Connection Verification**\n' +
            'Verify your zero-storage daemon status & mesh connectivity:\n' +
            '```bash\n./nodld --status\n```\n\n' +
            '**4. First-Run Checklist**\n' +
            '✅ Daemon running on port `:8080`\n' +
            '✅ Connected to Stripe Daily USD Payouts\n' +
            '✅ Zero disk storage consumed (100% ephemeral RAM fabric)';

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingIntro = null;
            let existingGuide = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #beta‑onboarding')) existingIntro = msg;
                    if (msg.content.includes('Wnode Beta Tester Quick-Start Guide')) existingGuide = msg;
                }
            }

            if (!existingIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }

            if (!existingGuide) {
                const msg = await channel.send({ content: guideText });
                await msg.pin().catch(() => {});
            }

            console.log('[BetaOnboardingManager] ✅ Ensured #beta-onboarding intro and quick-start guide pins.');
        } catch (err) {
            console.error('[BetaOnboardingManager] Failed to pin #beta-onboarding headers:', err);
        }
    }
}
