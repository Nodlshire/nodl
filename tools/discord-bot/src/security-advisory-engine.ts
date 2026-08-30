import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder } = require('discord.js');

export interface SecurityAdvisory {
    id: string; // Unique Advisory ID (e.g. WNODE-SA-2026-001)
    title: string;
    description: string;
    affectedComponents: string[];
    severity: 'critical' | 'moderate' | 'informational';
    cve?: string;
    remedy?: string;
    publishedAt: string;
}

export interface SecurityState {
    advisories: { [id: string]: { postedAt: string; hash: string } };
    introMessageId?: string;
    introMessageHash?: string;
}

const REGISTRY_PATH = process.env.SECURITY_REGISTRY_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/security-advisories.json'
        : path.resolve(__dirname, '../../services/nodld/state/security-advisories.json'));

export class SecurityAdvisoryEngine {
    private state: SecurityState = { advisories: {} };

    constructor() {
        this.loadState();
    }

    private loadState(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const data = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                this.state = JSON.parse(data);
            }
        } catch (err) {
            console.error('[SecurityAdvisoryEngine] Failed to load state:', err);
        }
    }

    private saveState(): void {
        try {
            const dir = path.dirname(REGISTRY_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(this.state, null, 2), 'utf-8');
        } catch (err) {
            console.error('[SecurityAdvisoryEngine] Failed to save state:', err);
        }
    }

    public calculateHash(text: string): string {
        return crypto.createHash('sha256').update(text.trim()).digest('hex');
    }

    // 1. Ensure Pinned Channel Intro Message in #security-updates
    public async ensureSecurityChannelIntro(guild: any): Promise<void> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'security-updates');
        if (!channel) return;

        const introText =
            '⚠️ **Welcome to #security‑updates!**\n' +
            'This channel delivers official cryptographic bulletins, vulnerability disclosures, and system security advisories for Wnode and its ecosystem.\n\n' +
            'Posts here are verified and timestamped. Subscribe to stay informed about critical patches, protocol changes, and DePIN network integrity alerts.';

        const currentHash = this.calculateHash(introText);
        if (this.state.introMessageHash === currentHash && this.state.introMessageId) {
            return; // Anti-noise rule: silent update / noop
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && (msg.content.includes('Welcome to #security') || msg.embeds[0]?.title?.includes('security'))) {
                    existingPinned = msg;
                    break;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('⚠️ Welcome to #security‑updates!')
                .setColor(0xF97316) // Orange accent
                .setDescription(
                    'This channel delivers official cryptographic bulletins, vulnerability disclosures, and system security advisories for Wnode and its ecosystem.\n\n' +
                    'Posts here are verified and timestamped. Subscribe to stay informed about critical patches, protocol changes, and DePIN network integrity alerts.'
                )
                .setFooter({ text: 'Wnode Sovereign Mesh • Official Security Channel' })
                .setTimestamp();

            if (existingPinned) {
                await existingPinned.edit({ content: introText, embeds: [embed] });
                this.state.introMessageId = existingPinned.id;
            } else {
                const message = await channel.send({ content: introText, embeds: [embed] });
                await message.pin().catch(() => {});
                this.state.introMessageId = message.id;
            }

            this.state.introMessageHash = currentHash;
            this.saveState();
            console.log('[SecurityAdvisoryEngine] ✅ Ensured #security-updates intro message is active and pinned.');
        } catch (err) {
            console.error('[SecurityAdvisoryEngine] Failed to ensure #security-updates channel intro:', err);
        }
    }

    // 2. Severity Color Coding Helper
    private getSeverityColor(severity: 'critical' | 'moderate' | 'informational'): number {
        switch (severity) {
            case 'critical':
                return 0xEF4444; // 🔴 Red
            case 'moderate':
                return 0xF97316; // 🟠 Orange
            case 'informational':
            default:
                return 0x10B981; // 🟢 Green
        }
    }

    // 3. Process and Post Verified Security Advisories
    public async processAndPostAdvisories(guild: any, advisories: SecurityAdvisory[]): Promise<void> {
        const channel = guild.channels.cache.find((c: any) => c.name === 'security-updates');
        if (!channel) return;

        for (const advisory of advisories) {
            // Deduplication Check
            if (this.state.advisories[advisory.id]) {
                continue; // Already posted, skip
            }

            const color = this.getSeverityColor(advisory.severity);
            const severityTag = advisory.severity.toUpperCase();

            const embed = new EmbedBuilder()
                .setTitle(`Security Advisory — ${advisory.title}`)
                .setColor(color)
                .setDescription(advisory.description)
                .addFields([
                    { name: '🔒 Advisory ID', value: `\`${advisory.id}\``, inline: true },
                    { name: '⚠️ Severity', value: `\`${severityTag}\``, inline: true },
                    { name: '📦 Affected Components', value: advisory.affectedComponents.map(c => `\`${c}\``).join(', ') || 'N/A', inline: false }
                ])
                .setFooter({ text: `Verified by Wnode Security — ${new Date(advisory.publishedAt).toUTCString()}` })
                .setTimestamp(new Date(advisory.publishedAt));

            if (advisory.cve) {
                embed.addFields([{ name: '🆔 CVE Reference', value: `\`${advisory.cve}\``, inline: true }]);
            }
            if (advisory.remedy) {
                embed.addFields([{ name: '🛠️ Recommended Action', value: advisory.remedy, inline: false }]);
            }

            let content = '';
            if (advisory.severity === 'critical') {
                const securityRole = guild.roles.cache.find((r: any) => r.name === 'Core Team') ||
                                     guild.roles.cache.find((r: any) => r.name === 'SecurityTeam');
                content = securityRole ? `<@&${securityRole.id}> 🚨 **CRITICAL SECURITY ADVISORY**` : `@here 🚨 **CRITICAL SECURITY ADVISORY**`;
            }

            try {
                await channel.send({ content: content || undefined, embeds: [embed] });

                // Record in persistent state
                this.state.advisories[advisory.id] = {
                    postedAt: new Date().toISOString(),
                    hash: this.calculateHash(JSON.stringify(advisory))
                };
                this.saveState();

                // Audit Log to /api/v1/system/pulse
                await this.logToSystemPulse(advisory);
                console.log(`[SecurityAdvisoryEngine] ✅ Published security advisory ${advisory.id} to #security-updates.`);
            } catch (err) {
                console.error(`[SecurityAdvisoryEngine] Failed to post advisory ${advisory.id}:`, err);
            }
        }
    }

    // 4. Audit Log to /api/v1/system/pulse
    private async logToSystemPulse(advisory: SecurityAdvisory): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'security_advisory_published',
                    advisory_id: advisory.id,
                    severity: advisory.severity,
                    timestamp: new Date().toISOString(),
                    source: 'discord_security_bot'
                })
            });
        } catch (err) {
            console.error('[SecurityAdvisoryEngine] Failed to log pulse to backend:', err);
        }
    }
}
