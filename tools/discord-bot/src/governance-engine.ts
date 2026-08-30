import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder } = require('discord.js');

export interface GovernanceState {
    introMessageId?: string;
    introMessageHash?: string;
    templateMessageId?: string;
}

const ENGINE_STATE_PATH = process.env.ENGINE_STATE_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/engine.json'
        : path.resolve(__dirname, '../../services/nodld/state/engine.json'));

export class GovernanceEngine {
    private state: GovernanceState = {};

    constructor() {
        this.loadState();
    }

    private loadState(): void {
        try {
            if (fs.existsSync(ENGINE_STATE_PATH)) {
                const data = fs.readFileSync(ENGINE_STATE_PATH, 'utf-8');
                const parsed = JSON.parse(data);
                this.state = parsed.governanceState || {};
            }
        } catch (err) {
            console.error('[GovernanceEngine] Failed to load engine state:', err);
        }
    }

    public calculateHash(content: string): string {
        return crypto.createHash('sha256').update(content.trim()).digest('hex');
    }

    // 1. Provision WUID Verified Role & Channel Overwrites
    public async ensureGovernanceChannel(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'governance' || c.id === '1540912045095129188');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'governance' || c?.id === '1540912045095129188');
        }
        if (!channel) return;

        // Ensure "WUID Verified" Role
        let wuidRole = guild.roles.cache.find((r: any) => r.name === 'WUID Verified');
        if (!wuidRole) {
            try {
                wuidRole = await guild.roles.create({
                    name: 'WUID Verified',
                    color: 0x10B981, // Emerald Green
                    reason: 'Role for confirmed CRM WUID holders'
                });
                console.log(`[GovernanceEngine] Created role 'WUID Verified' (ID: ${wuidRole.id})`);
            } catch (err) {
                console.error('[GovernanceEngine] Failed to create WUID Verified role:', err);
            }
        }

        // Apply Role Overwrites
        try {
            if (wuidRole) {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: false,
                    ViewChannel: true
                });
                await channel.permissionOverwrites.edit(wuidRole, {
                    SendMessages: true,
                    ViewChannel: true
                });
            }
        } catch (err) {
            console.error('[GovernanceEngine] Failed to set permission overwrites:', err);
        }

        // Pin Intro & Template Messages
        const introText =
            '🗳️ **Welcome to #governance!**\n' +
            'Only confirmed WUID holders with the **WUID Verified** role can submit proposals in this channel.\n' +
            'Unverified members have read-only access.\n' +
            'To link your WUID to your Discord account, verify your account in Nodlr/CMD or contact support.';

        const templateText =
            '📋 **Wnode Governance Proposal Template**\n\n' +
            '**Proposal Title:** [Title]\n' +
            '**Summary:** [Short Summary]\n' +
            '**Motivation:** [Why this change is needed]\n' +
            '**Impact:** [Expected ecosystem/operator impact]\n' +
            '**Voting Options:** Yes / No / Abstain';

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingIntro = null;
            let existingTemplate = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #governance')) existingIntro = msg;
                    if (msg.content.includes('Governance Proposal Template')) existingTemplate = msg;
                }
            }

            if (!existingIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }

            if (!existingTemplate) {
                const msg = await channel.send({ content: templateText });
                await msg.pin().catch(() => {});
            }
            console.log('[GovernanceEngine] ✅ Ensured #governance role overwrites, intro, and template pins.');
        } catch (err) {
            console.error('[GovernanceEngine] Failed to pin governance headers:', err);
        }
    }

    // 2. WUID Verification Check from SOT Engine State
    public isUserWUIDVerified(member: any): boolean {
        if (!member) return false;
        
        // 1. Check for WUID Verified Discord Role
        const hasRole = member.roles.cache.some((r: any) => r.name === 'WUID Verified');
        if (hasRole) return true;

        // 2. Check SOT engine.json for linked WUID record
        try {
            if (fs.existsSync(ENGINE_STATE_PATH)) {
                const data = JSON.parse(fs.readFileSync(ENGINE_STATE_PATH, 'utf-8'));
                const accounts = data.accounts || {};
                for (const accId in accounts) {
                    const acc = accounts[accId];
                    if (acc.wuid && (acc.discordId === member.id || acc.discord_id === member.id)) {
                        return true;
                    }
                }
            }
        } catch (err) {
            console.error('[GovernanceEngine] Failed to query CRM WUID state:', err);
        }

        return false;
    }

    // 3. Handle Incoming Proposals
    public async handleIncomingProposal(message: any): Promise<void> {
        if (message.author.bot) return;
        if (message.channel.name !== 'governance' && message.channel.id !== '1540912045095129188') return;

        const content = message.content.toLowerCase();
        const isProposal = content.startsWith('!proposal') || content.includes('proposal');

        if (!isProposal) return;

        const isVerified = this.isUserWUIDVerified(message.member);

        if (!isVerified) {
            // Unverified User Policy: Delete message & notify in-channel with 8s auto-delete
            try {
                await message.delete();
                const warningMsg = await message.channel.send({
                    content: `⚠️ <@${message.author.id}> Only verified WUID holders can submit proposals in **#governance**. Please link your account in Nodlr/CMD.`
                });
                setTimeout(() => warningMsg.delete().catch(() => {}), 8000);
            } catch (err) {
                console.error('[GovernanceEngine] Failed to handle unverified proposal:', err);
            }
            return;
        }

        // Verified Proposal Handling
        const embed = new EmbedBuilder()
            .setTitle('🗳️ Wnode Governance Proposal Submitted')
            .setColor(0x10B981)
            .setDescription(message.content)
            .addFields([
                { name: 'Author', value: `<@${message.author.id}>`, inline: true },
                { name: 'WUID Status', value: '`🟢 Verified WUID Holder`', inline: true },
                { name: 'Voting Options', value: '👍 **Yes** | 👎 **No** | ⚪ **Abstain**', inline: false }
            ])
            .setFooter({ text: 'Wnode Sovereign Mesh • Governance Engine' })
            .setTimestamp();

        try {
            await message.delete();
            const proposalMsg = await message.channel.send({
                content: `📢 **NEW PROPOSAL SUBMITTED** <@&1540911982713249824>`,
                embeds: [embed]
            });

            // Add Reaction Voting Buttons
            await proposalMsg.react('👍');
            await proposalMsg.react('👎');
            await proposalMsg.react('⚪');

            // Audit Pulse Trace
            await this.logPulseAudit(message.author.id, proposalMsg.id);
        } catch (err) {
            console.error('[GovernanceEngine] Failed to publish verified proposal:', err);
        }
    }

    // 4. Audit Log to /api/v1/system/pulse
    private async logPulseAudit(authorId: string, messageId: string): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'proposal_submitted',
                    author_id: authorId,
                    message_id: messageId,
                    timestamp: new Date().toISOString(),
                    source: 'discord_governance'
                })
            });
        } catch (err) {
            console.error('[GovernanceEngine] Failed to log pulse audit:', err);
        }
    }
}
