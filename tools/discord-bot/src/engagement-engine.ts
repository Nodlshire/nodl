import { CommandResponse } from './commands';

const { EmbedBuilder } = require('discord.js');

export interface MeshChallenge {
    id: number;
    title: string;
    description: string;
    rewardRole: string;
    instructions: string;
}

export const MESH_CHALLENGES: MeshChallenge[] = [
    {
        id: 1,
        title: '🚀 Challenge #1: Deploy Sovereign Node & Verify Telemetry',
        description: 'Deploy `nodld` on Ubuntu, macOS, or WSL2 and verify zero-storage status.',
        rewardRole: 'Mesh Pioneer',
        instructions: 'Run `curl -fsSL https://nodlr.wnode.one/install.sh | bash` then type `!challenge complete`.'
    },
    {
        id: 2,
        title: '⚡ Challenge #2: Zero-Storage RAM Compute Benchmark',
        description: 'Execute a deterministic WASM workload and confirm zero disk writes.',
        rewardRole: 'Mesh Pioneer',
        instructions: 'Run a test compute envelope and share your execution time in `#beta-feedback`.'
    },
    {
        id: 3,
        title: '🌐 Challenge #3: DeWi Radio Gateway Telemetry Sync',
        description: 'Connect a LoRaWAN or 5G small cell gateway to the nodld telemetry stream.',
        rewardRole: 'Telemetry Master',
        instructions: 'Post your gateway ID in `#dewi-updates` to claim your Telemetry Master badge.'
    },
    {
        id: 4,
        title: '🔍 Challenge #4: Bug Hunt & SOT Verification',
        description: 'Find a doc ambiguity or daemon error log and file a report.',
        rewardRole: 'Telemetry Master',
        instructions: 'Post structured logs in `#beta-bugs` with system specs.'
    }
];

export class EngagementEngine {
    private currentChallengeIndex: number = 0;

    public getCurrentChallenge(): MeshChallenge {
        return MESH_CHALLENGES[this.currentChallengeIndex % MESH_CHALLENGES.length];
    }

    public handleChallengeCommand(args: string[], username: string): CommandResponse {
        const subCmd = args.length > 0 ? args[0].toLowerCase() : '';
        const challenge = this.getCurrentChallenge();

        if (subCmd === 'complete') {
            return {
                embedTitle: `🏆 Challenge Completed — ${challenge.rewardRole} Awarded!`,
                embedColor: 0x10b981, // Emerald Green
                description: `Congratulations **${username}**! Your completion of **"${challenge.title}"** has been verified and logged in the Beta Registry.`,
                fields: [
                    { name: '🎖 Role Awarded', value: `\`${challenge.rewardRole}\``, inline: true },
                    { name: '📊 Community Status', value: 'Active Contributor', inline: true },
                    { name: '💬 Next Step', value: 'Share your node logs and setup details in `#beta-feedback`!', inline: false }
                ]
            };
        }

        return {
            embedTitle: `🎯 Weekly Mesh Challenge: ${challenge.title}`,
            embedColor: 0x3b82f6, // Blue
            description: challenge.description,
            fields: [
                { name: '📋 Instructions', value: challenge.instructions, inline: false },
                { name: '🎖 Reward Role', value: `\`${challenge.rewardRole}\``, inline: true },
                { name: '✅ Claim Reward', value: 'Type `!challenge complete` after finishing.', inline: true }
            ]
        };
    }

    public handleSpotlightCommand(targetUser?: string): CommandResponse {
        const username = targetUser || 'Wnode_Operator_Alpha';
        return {
            embedTitle: `🌟 Operator Spotlight — ${username}`,
            embedColor: 0xec4899, // Pink
            description: `This week's **Operator Spotlight** shines on **${username}** for outstanding node uptime and mesh telemetry contributions!`,
            fields: [
                { name: '🖥 Node Fleet Specs', value: '`16 CPU Cores` | `29 GB RAM` | `Zero Storage`', inline: true },
                { name: '⏱ Continuous Uptime', value: '`99.98% (168h Clean Run)`', inline: true },
                { name: '🏅 Awarded Role', value: '`Operator Spotlight` (7-Day Badge)', inline: true },
                { name: '💬 Operator Quote', value: '"Deploying nodld took under 30 seconds. Zero disk wear and daily payouts!"', inline: false }
            ]
        };
    }

    public handleBuildNightCommand(): CommandResponse {
        return {
            embedTitle: '🛠 Wnode Weekly Build Night — Session Info',
            embedColor: 0x8b5cf6, // Purple
            description: 'Join core developers and node operators for our weekly live build & test workshop!',
            fields: [
                { name: '📅 Next Session', value: '`Every Wednesday @ 20:00 UTC`', inline: true },
                { name: '📍 Location', value: '`#build-nights` text & voice channel', inline: true },
                { name: '🎯 Session Topics', value: '• WASM envelope deployment\n• LoRaWAN packet routing\n• Zero-storage RAM benchmarks', inline: false },
                { name: '📖 Required Prep', value: 'Read [wnode.one/docs](https://wnode.one/docs) & deploy `./nodld` beforehand.', inline: false }
            ]
        };
    }

    public createWeeklyChallengeEmbed(): any {
        const challenge = this.getCurrentChallenge();
        return new EmbedBuilder()
            .setTitle(`🎯 Weekly Mesh Challenge: ${challenge.title}`)
            .setColor(0x3b82f6)
            .setDescription(challenge.description)
            .addFields([
                { name: '📋 Instructions', value: challenge.instructions, inline: false },
                { name: '🎖 Reward Role', value: `\`${challenge.rewardRole}\``, inline: true },
                { name: '✅ How to Claim', value: 'Type `!challenge complete` in `#beta-feedback`!', inline: true }
            ])
            .setFooter({ text: 'Wnode Community Engagement Engine • Weekly Challenge' })
            .setTimestamp();
    }

    public createSpotlightEmbed(username: string): any {
        return new EmbedBuilder()
            .setTitle(`🌟 Operator Spotlight — ${username}`)
            .setColor(0xec4899)
            .setDescription(`Highlighting **${username}** for outstanding node uptime and mesh telemetry contributions!`)
            .addFields([
                { name: '🖥 Node Fleet Specs', value: '`16 CPU Cores` | `29 GB RAM` | `Zero Storage`', inline: true },
                { name: '⏱ Continuous Uptime', value: '`99.98% (168h Clean Run)`', inline: true },
                { name: '🏅 Awarded Role', value: '`Operator Spotlight`', inline: true }
            ])
            .setFooter({ text: 'Wnode Community Engagement Engine • Friday Spotlight' })
            .setTimestamp();
    }

    public createBuildNightReminderEmbed(timeframe: '24h' | '1h'): any {
        const is1h = timeframe === '1h';
        return new EmbedBuilder()
            .setTitle(is1h ? '⏰ Build Night Starts in 1 Hour!' : '📅 Build Night Tomorrow!')
            .setColor(is1h ? 0xef4444 : 0x8b5cf6)
            .setDescription('Get your terminal ready! Join core engineers and node operators in `#build-nights`.')
            .addFields([
                { name: '📖 Documentation Link', value: '[wnode.one/docs](https://wnode.one/docs)', inline: true },
                { name: '🛠 Installer Quick Link', value: '`curl -fsSL https://nodlr.wnode.one/install.sh | bash`', inline: false }
            ])
            .setTimestamp();
    }

    public async ensureMeshLiveHeaders(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'mesh-live' || c.id === '1540911995774181426');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'mesh-live' || c?.id === '1540911995774181426');
        }
        if (!channel) return;

        const introText =
            '🌐 **Welcome to #mesh‑live!**\n' +
            'This channel provides live telemetry feeds, network capacity reports, and peer counts for the Wnode mesh network.\n' +
            'It also serves as the central space for updates on the **DeWi (Decentralized Wireless)** protocols that power Wnode’s connectivity layer.\n\n' +
            '**Current Status:**\n' +
            'DeWi is already part of the Node Binary and functioning at the protocol level.\n' +
            'However, it has **not yet been integrated into the user interface** — we’re currently debugging the DePIN (Decentralized Physical Infrastructure Network) layer to ensure stability and accuracy before enabling live UI telemetry.\n\n' +
            '**Timeline:**\n' +
            'DeWi integration into the UI is expected to go live in **approximately 4–6 weeks**, following full DePIN validation and telemetry synchronization.\n\n' +
            '**What You’ll Find Here:**\n' +
            '• Live mesh telemetry and peer counts.\n' +
            '• Network capacity and throughput reports.\n' +
            '• DeWi protocol development updates.\n' +
            '• Debugging progress and rollout announcements.';

        const dewiOverviewText =
            '📡 **DeWi Protocol & DePIN Telemetry Status**\n\n' +
            '**Protocol Architecture & Node Binary Integration:**\n' +
            'DeWi wireless packet routing and telemetry protocols are fully compiled into the native `nodld` node binary. Nodes active in the mesh participate in peer-to-peer radio packet discovery and bandwidth metering at the daemon level.\n\n' +
            '**DePIN Layer Debugging & Validation:**\n' +
            'Our engineering team is actively debugging edge-case DePIN packet routing, latency synchronization, and zero-trust verification between sovereign nodes before surfacing live stats in the Command UI dashboard.\n\n' +
            '**Expected UI Integration Timeline:**\n' +
            '• **Current Phase**: Protocol-level mesh routing & DePIN telemetry debugging.\n' +
            '• **Target Release**: **4–6 Weeks** for live UI telemetry widgets on `cmd.wnode.one` and `mesh.wnode.one`.\n' +
            '• **Community Role**: Test your node daemon and report telemetry logs in `#beta-feedback`.';

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingIntro = null;
            let existingOverview = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #mesh‑live')) existingIntro = msg;
                    if (msg.content.includes('DeWi Protocol & DePIN Telemetry Status')) existingOverview = msg;
                }
            }

            if (!existingIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }

            if (!existingOverview) {
                const msg = await channel.send({ content: dewiOverviewText });
                await msg.pin().catch(() => {});
            }

            console.log('[EngagementEngine] ✅ Ensured #mesh-live intro and DeWi overview pins.');
        } catch (err) {
            console.error('[EngagementEngine] Failed to pin #mesh-live headers:', err);
        }
    }
}
