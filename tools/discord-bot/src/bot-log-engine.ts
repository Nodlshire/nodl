import fs from 'fs';
import path from 'path';

const { EmbedBuilder } = require('discord.js');

export type LogEventType = 'command_executed' | 'bot_reindexed' | 'bot_error' | 'bot_heartbeat';

export interface LogPayload {
    eventType: LogEventType;
    summary: string;
    source?: string;
    details?: { name: string; value: string; inline?: boolean }[];
    severity?: 'info' | 'warn' | 'critical';
}

export class BotLoggerEngine {
    private channelId: string = '1541332802942013464';

    // 1. Ensure Channel Overwrites & Pinned Headers
    public async ensureBotLogChannel(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'bot-log' || c.id === this.channelId);
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'bot-log' || c?.id === this.channelId);
        }
        if (!channel) return;

        const modRole = guild.roles.cache.find((r: any) => r.name === 'Moderator');
        const coreRole = guild.roles.cache.find((r: any) => r.name === 'Core Team' || r.id === '1540911982713249824');

        // Apply Permissions
        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone.id, {
                ViewChannel: false
            });
            if (modRole) {
                await channel.permissionOverwrites.edit(modRole.id, {
                    ViewChannel: true,
                    SendMessages: false
                });
            }
            if (coreRole) {
                await channel.permissionOverwrites.edit(coreRole.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ManageMessages: true
                });
            }
        } catch (err) {
            console.error('[BotLoggerEngine] Permission overwrite error:', err);
        }

        // Pinned Headers
        const introText =
            '⚙️ **Welcome to #bot‑log!**\n' +
            'This channel records internal bot activity, command execution, and re‑indexing events for audit and transparency.\n' +
            'All entries are automatically generated and timestamped.\n\n' +
            '**What You’ll See Here:**\n' +
            '• Bot startup and shutdown events.\n' +
            '• Command execution logs.\n' +
            '• Re‑indexing and cache refresh operations.\n' +
            '• Error and exception reports.\n' +
            '• System heartbeat and telemetry updates.';

        const policyText =
            '🧩 **Bot Logging Policy**\n' +
            '• All logs are generated automatically — do not post manually.\n' +
            '• Each entry includes timestamp, command source, and execution result.\n' +
            '• Critical errors are tagged for immediate review by the Core Team.\n' +
            '• Logs older than 30 days are archived automatically.';

        try {
            const pinned = await channel.messages.fetchPinned().catch(() => new Map());
            let hasIntro = false;
            let hasPolicy = false;

            for (const [_, msg] of pinned) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #bot‑log')) hasIntro = true;
                    if (msg.content.includes('Bot Logging Policy')) hasPolicy = true;
                }
            }

            if (!hasIntro) {
                const msg = await channel.send({ content: introText });
                await msg.pin().catch(() => {});
            }
            if (!hasPolicy) {
                const msg = await channel.send({ content: policyText });
                await msg.pin().catch(() => {});
            }
            console.log('[BotLoggerEngine] ✅ Ensured #bot-log permissions and pinned headers.');
        } catch (err) {
            console.error('[BotLoggerEngine] Failed to pin headers:', err);
        }
    }

    // 2. Format & Post Automated Log Entry
    public async logEvent(guild: any, payload: LogPayload): Promise<void> {
        const channel = guild.channels.cache.get(this.channelId) || 
            await guild.channels.fetch(this.channelId).catch(() => null);

        if (!channel) return;

        const now = new Date();
        const timestampStr = now.toUTCString();

        let color = 0x3B82F6; // Blue for command_executed
        if (payload.eventType === 'bot_reindexed') color = 0x10B981; // Green
        if (payload.eventType === 'bot_error') color = 0xEF4444; // Red
        if (payload.eventType === 'bot_heartbeat') color = 0x8B5CF6; // Purple

        const embed = new EmbedBuilder()
            .setTitle(`[${payload.eventType.toUpperCase()}] — ${timestampStr}`)
            .setColor(color)
            .setDescription(payload.summary)
            .setFooter({ text: `Logged by Wnode Bot — ${timestampStr}` })
            .setTimestamp(now);

        if (payload.source) {
            embed.addFields([{ name: 'Source', value: `\`${payload.source}\``, inline: true }]);
        }

        if (payload.details && payload.details.length > 0) {
            embed.addFields(payload.details);
        }

        const isCritical = payload.severity === 'critical' || payload.eventType === 'bot_error';
        const contentStr = isCritical ? '🚨 **CRITICAL BOT EVENT ALERT** <@&1540911982713249824>' : undefined;

        try {
            await channel.send({
                content: contentStr,
                embeds: [embed]
            });

            // Pulse Audit Trace
            await this.logPulseAudit(payload);
        } catch (err) {
            console.error('[BotLoggerEngine] Failed to post log embed:', err);
        }
    }

    // 3. System Pulse Audit Trace
    private async logPulseAudit(payload: LogPayload): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'bot_log_entry',
                    event_type: payload.eventType,
                    summary: payload.summary,
                    severity: payload.severity || 'info',
                    timestamp: new Date().toISOString(),
                    source: 'discord_bot_logger'
                })
            });
        } catch (e) {}
    }
}
