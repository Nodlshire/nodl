import crypto from 'crypto';

const { EmbedBuilder } = require('discord.js');

const PROTOCOL_VERSION = 'v1.0.0';

export class AnnouncementCadenceEngine {
    private seenAnnouncementHashes: Set<string> = new Set();
    private lastWeeklySummaryTimestamp: number = 0;

    // 1. Post Major Update Announcement (Verified Bugs, New Releases, Protocol Upgrades, Major Docs)
    public async postMajorAnnouncement(
        guild: any,
        title: string,
        category: string,
        description: string,
        fields: { name: string; value: string; inline?: boolean }[],
        docUrl: string = 'https://wnode.one/docs'
    ): Promise<boolean> {
        try {
            const announcementsChannel = guild.channels.cache.find((c: any) => c.name === 'announcements');
            if (!announcementsChannel) return false;

            const contentString = `${title}:${category}:${description}`;
            const hash = crypto.createHash('sha256').update(contentString).digest('hex');

            // Anti-Noise & Deduplication Check
            if (this.seenAnnouncementHashes.has(hash)) {
                console.log(`[AnnouncementCadence] Blocked duplicate announcement: "${title}"`);
                return false;
            }
            this.seenAnnouncementHashes.add(hash);

            const embed = new EmbedBuilder()
                .setTitle(`📢 ${title}`)
                .setColor(0x8b5cf6) // Purple
                .setDescription(description)
                .addFields([
                    { name: '🔖 Category', value: category, inline: true },
                    { name: '🏷 Protocol Version', value: PROTOCOL_VERSION, inline: true },
                    ...fields,
                    { name: '📖 Authoritative Documentation', value: `[Read Specification](${docUrl})`, inline: false }
                ])
                .setFooter({ text: 'Wnode Sovereign Compute Mesh • SOT Announcement' })
                .setTimestamp();

            const msg = await announcementsChannel.send({ embeds: [embed] });
            console.log(`[AnnouncementCadence] 📢 Posted Major Announcement in #${announcementsChannel.name}`);

            // Unpin older bot announcements and pin the latest
            await this.pinLatestAnnouncement(announcementsChannel, msg);
            return true;
        } catch (err: any) {
            console.error('[AnnouncementCadence] Error posting major announcement:', err.message || err);
            return false;
        }
    }

    // 2. Weekly Sunday Summary
    public async postWeeklySundaySummary(guild: any): Promise<boolean> {
        try {
            const now = Date.now();
            // Max 1 weekly summary per 6 days
            if (now - this.lastWeeklySummaryTimestamp < 6 * 24 * 60 * 60 * 1000) {
                return false;
            }

            const announcementsChannel = guild.channels.cache.find((c: any) => c.name === 'announcements');
            if (!announcementsChannel) return false;

            this.lastWeeklySummaryTimestamp = now;

            const summaryEmbed = new EmbedBuilder()
                .setTitle('📊 Wnode Weekly Mesh & Protocol Digest')
                .setColor(0x10b981) // Emerald Green
                .setDescription('Here is your Sunday summary of protocol progress, resolved items, and documentation updates across the sovereign mesh:')
                .addFields([
                    { name: '🛠 Top Resolved Issues', value: '• Fixed pinned telemetry message array conversion\n• Gated feedback loop with role verification', inline: false },
                    { name: '🚀 New Features Added', value: '• Automated 60-second Beta Onboarding flow\n• Interactive 3-question eligibility modal\n• Live `!nodes` status updater', inline: false },
                    { name: '📚 Canonical Docs Updated', value: '• `/docs/04-node-operator/getting-started`\n• `/docs/08-operations/discord-server-specification`', inline: false },
                    { name: '⚡ Mesh Improvements', value: '• `3 Active Nodes` | `16 Cores` | `29 GB RAM` | `99.98% Uptime`', inline: false },
                    { name: '🔗 Quick Links', value: '[Documentation Canon](https://wnode.one/docs) • [Nodlr Installer](https://nodlr.wnode.one)', inline: false }
                ])
                .setFooter({ text: 'Wnode Weekly Digest • Every Sunday' })
                .setTimestamp();

            const msg = await announcementsChannel.send({ embeds: [summaryEmbed] });
            await this.pinLatestAnnouncement(announcementsChannel, msg);
            console.log(`[AnnouncementCadence] 📊 Posted Weekly Sunday Summary in #${announcementsChannel.name}`);
            return true;
        } catch (err: any) {
            console.error('[AnnouncementCadence] Error posting weekly summary:', err.message || err);
            return false;
        }
    }

    // 3. Governance Decision Summary
    public async postGovernanceDecision(guild: any, proposalTitle: string, outcome: 'APPROVED' | 'REJECTED', summary: string): Promise<boolean> {
        const isApproved = outcome === 'APPROVED';
        return this.postMajorAnnouncement(
            guild,
            `Soul-DAO Decision: ${proposalTitle}`,
            'Governance Decision',
            `The Soul-DAO 1-Soul-1-Vote proposal **"${proposalTitle}"** has been **${outcome}**.`,
            [
                { name: '🗳 Outcome', value: isApproved ? '🟢 APPROVED' : '🔴 REJECTED', inline: true },
                { name: '📋 Decision Summary', value: summary, inline: false }
            ],
            'https://wnode.one/docs/06-economics-governance'
        );
    }

    // 4. Pinning Helper (Unpins older bot announcements)
    private async pinLatestAnnouncement(channel: any, newMsg: any): Promise<void> {
        try {
            let pinned: any;
            if (channel.messages.fetchPins) {
                pinned = await channel.messages.fetchPins();
            } else if (channel.messages.fetchPinned) {
                pinned = await channel.messages.fetchPinned();
            } else {
                pinned = await channel.messages.fetch({ pinned: true });
            }

            const pinnedArray = Array.isArray(pinned) ? pinned : Array.from(pinned.values ? pinned.values() : []);
            for (const prevPin of pinnedArray) {
                if (prevPin.author && prevPin.author.id === newMsg.author.id && prevPin.id !== newMsg.id) {
                    await prevPin.unpin();
                }
            }

            await newMsg.pin();
        } catch (err: any) {
            console.error('[AnnouncementCadence] Pin helper warning:', err.message || err);
        }
    }
}
