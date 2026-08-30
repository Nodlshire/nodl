import fs from 'fs';
import path from 'path';

const { PermissionFlagsBits } = require('discord.js');

export class BetaTestersModeratorsEngine {

    // 1. Provision Roles & Channels with Strict Permissions
    public async ensureChannelsAndRoles(guild: any): Promise<void> {
        // A. Ensure Roles
        let srModRole = guild.roles.cache.find((r: any) => r.name === 'Senior Moderator');
        if (!srModRole) {
            try {
                srModRole = await guild.roles.create({
                    name: 'Senior Moderator',
                    color: 0xEF4444, // Red
                    reason: 'Senior Moderator role for Stephen'
                });
                console.log(`[BetaTestersModeratorsEngine] Created 'Senior Moderator' role (ID: ${srModRole.id})`);
            } catch (err) {
                console.error('[BetaTestersModeratorsEngine] Failed to create Senior Moderator role:', err);
            }
        }

        let modRole = guild.roles.cache.find((r: any) => r.name === 'Moderator');
        if (!modRole) {
            try {
                modRole = await guild.roles.create({
                    name: 'Moderator',
                    color: 0xF59E0B, // Amber
                    reason: 'Standard Moderator role'
                });
                console.log(`[BetaTestersModeratorsEngine] Created 'Moderator' role (ID: ${modRole.id})`);
            } catch (err) {
                console.error('[BetaTestersModeratorsEngine] Failed to create Moderator role:', err);
            }
        }

        let betaRole = guild.roles.cache.find((r: any) => r.name === 'Beta Tester');

        // B. Provision #beta-testers
        let betaTestersChan = guild.channels.cache.find((c: any) => c.name === 'beta-testers');
        if (!betaTestersChan) {
            const betaCategory = guild.channels.cache.find((c: any) => c.name.includes('Beta Testers') && c.type === 4);
            try {
                betaTestersChan = await guild.channels.create({
                    name: 'beta-testers',
                    type: 0,
                    parent: betaCategory?.id,
                    permissionOverwrites: [
                        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.SendMessages], allow: [PermissionFlagsBits.ViewChannel] },
                        ...(betaRole ? [{ id: betaRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }] : []),
                        ...(modRole ? [{ id: modRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }] : []),
                        ...(srModRole ? [{ id: srModRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }] : [])
                    ]
                });
                console.log(`[BetaTestersModeratorsEngine] Created #beta-testers channel (ID: ${betaTestersChan.id})`);
            } catch (err) {
                console.error('[BetaTestersModeratorsEngine] Failed to create #beta-testers channel:', err);
            }
        }

        // C. Provision #moderators (Private)
        let moderatorsChan = guild.channels.cache.find((c: any) => c.name === 'moderators');
        if (!moderatorsChan) {
            const adminCategory = guild.channels.cache.find((c: any) => c.name.includes('Bot & System Admin') && c.type === 4);
            try {
                moderatorsChan = await guild.channels.create({
                    name: 'moderators',
                    type: 0,
                    parent: adminCategory?.id,
                    permissionOverwrites: [
                        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                        ...(modRole ? [{ id: modRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory] }] : []),
                        ...(srModRole ? [{ id: srModRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels] }] : [])
                    ]
                });
                console.log(`[BetaTestersModeratorsEngine] Created #moderators channel (ID: ${moderatorsChan.id})`);
            } catch (err) {
                console.error('[BetaTestersModeratorsEngine] Failed to create #moderators channel:', err);
            }
        }

        // D. Provision #moderator-handbook (Read-Only for Moderators, Full Access for Senior Moderator)
        let handbookChan = guild.channels.cache.find((c: any) => c.name === 'moderator-handbook' || c.id === '1540933738307788832');
        if (handbookChan) {
            try {
                await handbookChan.permissionOverwrites.edit(guild.roles.everyone.id, { ViewChannel: false });
                if (modRole) {
                    await handbookChan.permissionOverwrites.edit(modRole.id, { ViewChannel: true, SendMessages: false });
                }
                if (srModRole) {
                    await handbookChan.permissionOverwrites.edit(srModRole.id, { ViewChannel: true, SendMessages: true, ManageMessages: true });
                }
            } catch (err) {
                console.error('[BetaTestersModeratorsEngine] Failed to set permissions on #moderator-handbook:', err);
            }
        }

        // E. Pin Headers in #beta-testers
        if (betaTestersChan) {
            await this.ensureBetaTestersHeaders(betaTestersChan, guild.client.user.id);
        }

        // F. Pin Headers in #moderators
        if (moderatorsChan) {
            await this.ensureModeratorsHeaders(moderatorsChan, guild.client.user.id);
        }
    }

    private async ensureBetaTestersHeaders(channel: any, botUserId: string): Promise<void> {
        const introText =
            '🧩 **Welcome to #beta‑testers!**\n' +
            'This channel is for all registered beta testers participating in Wnode’s Public Beta program.\n' +
            'Here you can:\n' +
            '• Meet other testers and exchange insights.\n' +
            '• Ask questions about setup, testing, and reporting.\n' +
            '• Share discoveries, bugs, and suggestions.\n' +
            '• Get advice from moderators and developers.';

        const pinnedText =
            '🧪 **Beta Testing Guidelines**\n' +
            '• Always use the latest release candidate.\n' +
            '• Report issues in #beta-feedback using the feedback template.\n' +
            '• Keep discussions constructive and focused on testing.\n' +
            '• Respect confidentiality — do not share unreleased features outside this server.';

        try {
            const pinned = await channel.messages.fetchPinned().catch(() => new Map());
            let hasIntro = false;
            let hasPinned = false;

            for (const [_, msg] of pinned) {
                if (msg.author.id === botUserId) {
                    if (msg.content.includes('Welcome to #beta‑testers')) hasIntro = true;
                    if (msg.content.includes('Beta Testing Guidelines')) hasPinned = true;
                }
            }

            if (!hasIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }
            if (!hasPinned) {
                const msg = await channel.send({ content: pinnedText });
                await msg.pin().catch(() => {});
            }
        } catch (err) {
            console.error('[BetaTestersModeratorsEngine] Failed to pin #beta-testers headers:', err);
        }
    }

    private async ensureModeratorsHeaders(channel: any, botUserId: string): Promise<void> {
        const introText =
            '🛡️ **Welcome to #moderators!**\n' +
            'This private channel is reserved for Wnode moderators.\n' +
            'Use it for:\n' +
            '• Internal discussions and moderation planning.\n' +
            '• Reviewing reports and community issues.\n' +
            '• Coordinating events and announcements.\n' +
            '• Managing permissions and onboarding new moderators.';

        const pinnedText =
            '🔒 **Moderator Guidelines**\n' +
            '• Maintain confidentiality — discussions here stay private.\n' +
            '• Treat all users fairly and follow community standards.\n' +
            '• Escalate serious issues to the Senior Moderator (Stephen).\n' +
            '• Use #admin-dashboard for system telemetry and audit logs.';

        try {
            const pinned = await channel.messages.fetchPinned().catch(() => new Map());
            let hasIntro = false;
            let hasPinned = false;

            for (const [_, msg] of pinned) {
                if (msg.author.id === botUserId) {
                    if (msg.content.includes('Welcome to #moderators')) hasIntro = true;
                    if (msg.content.includes('Moderator Guidelines')) hasPinned = true;
                }
            }

            if (!hasIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }
            if (!hasPinned) {
                const msg = await channel.send({ content: pinnedText });
                await msg.pin().catch(() => {});
            }
        } catch (err) {
            console.error('[BetaTestersModeratorsEngine] Failed to pin #moderators headers:', err);
        }
    }

    // 2. Automation Logic for Messages
    public async handleMessage(message: any): Promise<void> {
        if (message.author.bot) return;
        const channelName = message.channel.name;

        // A. Automation for #beta-testers
        if (channelName === 'beta-testers') {
            const text = message.content.toLowerCase();

            // Auto-tag @Core Team when message contains "bug" or "issue"
            if (text.includes('bug') || text.includes('issue')) {
                try {
                    await message.reply({
                        content: `⚠️ Core Team notified: <@&1540911982713249824>. Please also submit formal bug details in <#1540912048873934940> (#beta-feedback) using the feedback template!`
                    });
                } catch (e) {}
            } else {
                // Auto-reply thank you reaction
                try {
                    await message.react('🙌');
                } catch (e) {}
            }

            // Pulse Audit Log
            await this.logPulseAudit('beta_tester_message', {
                author_id: message.author.id,
                channel_id: message.channel.id
            });
        }

        // B. Automation for #moderators Audit Traces
        if (channelName === 'moderators') {
            await this.logPulseAudit('moderator_action', {
                author_id: message.author.id,
                action: 'channel_discussion'
            });
        }
    }

    private async logPulseAudit(eventType: string, payload: any): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: eventType,
                    payload,
                    timestamp: new Date().toISOString(),
                    source: 'discord_bot'
                })
            });
        } catch (e) {}
    }
}
