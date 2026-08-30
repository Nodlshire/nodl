import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const { EmbedBuilder } = require('discord.js');

export interface VulnerabilityReport {
    id: string; // Report ID e.g. WNODE-VR-2026-001
    reporterId: string;
    reporterTag: string;
    messageId: string;
    severity: 'critical' | 'moderate' | 'informational';
    keywordsDetected: string[];
    wasDeleted: boolean;
    timestamp: string;
}

export interface DisclosureState {
    reports: { [id: string]: VulnerabilityReport };
    introMessageId?: string;
    introMessageHash?: string;
}

const REGISTRY_PATH = process.env.DISCLOSURE_REGISTRY_PATH ||
    (fs.existsSync('/home/obregan/wnode/services/nodld/state')
        ? '/home/obregan/wnode/services/nodld/state/responsible-disclosures.json'
        : path.resolve(__dirname, '../../services/nodld/state/responsible-disclosures.json'));

export class ResponsibleDisclosureEngine {
    private state: DisclosureState = { reports: {} };

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
            console.error('[ResponsibleDisclosureEngine] Failed to load state:', err);
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
            console.error('[ResponsibleDisclosureEngine] Failed to save state:', err);
        }
    }

    public calculateHash(text: string): string {
        return crypto.createHash('sha256').update(text.trim()).digest('hex');
    }

    // 1. Ensure Pinned Channel Intro in #responsible-disclosure
    public async ensureDisclosureChannelIntro(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'responsible-disclosure' || c.id === '1540912032021479484');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'responsible-disclosure' || c?.id === '1540912032021479484');
        }
        if (!channel) return;

        const introText =
            '🛡️ **Welcome to #responsible‑disclosure!**\n' +
            'This channel is reserved for confidential vulnerability reports and coordinated disclosure discussions.\n' +
            'If you’ve discovered a potential security issue, please follow the responsible disclosure guidelines below:\n' +
            '• Report privately — never post exploit details publicly.\n' +
            '• Include affected components, severity, and reproduction steps.\n' +
            '• Our security team will acknowledge receipt and coordinate a fix.\n' +
            'Thank you for helping keep Wnode and the DePIN ecosystem secure.';

        const currentHash = this.calculateHash(introText);
        if (this.state.introMessageHash === currentHash && this.state.introMessageId) {
            return;
        }

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingPinned = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id && (msg.content.includes('Welcome to #responsible') || msg.embeds[0]?.title?.includes('responsible'))) {
                    existingPinned = msg;
                    break;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('🛡️ Welcome to #responsible‑disclosure!')
                .setColor(0x3B82F6) // Blue accent
                .setDescription(
                    'This channel is reserved for confidential vulnerability reports and coordinated disclosure discussions.\n\n' +
                    'If you’ve discovered a potential security issue, please follow the responsible disclosure guidelines below:\n' +
                    '• **Report privately** — never post exploit details publicly.\n' +
                    '• **Include details** — affected components, severity, and reproduction steps.\n' +
                    '• **Coordination** — Our security team will acknowledge receipt and coordinate a fix.\n\n' +
                    'Thank you for helping keep Wnode and the DePIN ecosystem secure.'
                )
                .setFooter({ text: 'Wnode Sovereign Mesh • Security Response Team' })
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
            console.log('[ResponsibleDisclosureEngine] ✅ Pinned channel intro in #responsible-disclosure.');
        } catch (err) {
            console.error('[ResponsibleDisclosureEngine] Failed to pin intro message:', err);
        }
    }

    // 2. Sensitive Keyword Analysis
    private analyzeReportContent(content: string): { severity: 'critical' | 'moderate' | 'informational'; keywords: string[] } {
        const lower = content.toLowerCase();
        const criticalKeywords = ['exploit', 'zero-day', '0day', 'rce', 'privilege escalation', 'auth bypass', 'leak', 'dump', 'attack'];
        const moderateKeywords = ['payload', 'poc', 'vulnerability', 'xss', 'sqli', 'csrf', 'dos', 'overflow'];

        const detectedKeywords: string[] = [];

        for (const kw of criticalKeywords) {
            if (lower.includes(kw)) detectedKeywords.push(kw);
        }
        if (detectedKeywords.length > 0) {
            return { severity: 'critical', keywords: detectedKeywords };
        }

        for (const kw of moderateKeywords) {
            if (lower.includes(kw)) detectedKeywords.push(kw);
        }
        if (detectedKeywords.length > 0) {
            return { severity: 'moderate', keywords: detectedKeywords };
        }

        return { severity: 'informational', keywords: [] };
    }

    // 3. Handle Incoming Message in #responsible-disclosure
    public async handleIncomingMessage(message: any): Promise<void> {
        if (message.author?.bot) return;
        if (message.channel?.name !== 'responsible-disclosure' && message.channel?.id !== '1540912032021479484') return;

        const reportId = `WNODE-VR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const analysis = this.analyzeReportContent(message.content);

        // Delete public message if sensitive exploit keywords are present to protect privacy
        const containsExploitPayload = analysis.keywords.length > 0 || message.content.length > 500;
        let wasDeleted = false;
        if (containsExploitPayload) {
            await message.delete().catch(() => {});
            wasDeleted = true;
        }

        const color = analysis.severity === 'critical' ? 0xEF4444 : (analysis.severity === 'moderate' ? 0xF97316 : 0x10B981);

        const securityRole = message.guild?.roles.cache.find((r: any) => r.name === 'Core Team') ||
                             message.guild?.roles.cache.find((r: any) => r.name === 'SecurityTeam');
        const roleMention = securityRole ? `<@&${securityRole.id}>` : '@here';

        const ackEmbed = new EmbedBuilder()
            .setTitle('Security Report Acknowledged')
            .setColor(color)
            .setDescription('Your report has been logged and will be reviewed by Wnode Security.')
            .addFields([
                { name: '📋 Report ID', value: `\`${reportId}\``, inline: true },
                { name: '👤 Reporter', value: `<@${message.author.id}>`, inline: true },
                { name: '⚠️ Preliminary Severity', value: `\`${analysis.severity.toUpperCase()}\``, inline: true },
                { name: '🔒 Confidentiality Action', value: wasDeleted ? '`Sensitive Payload Redacted for Privacy`' : '`Standard Report Logged`', inline: false },
                { name: '🛡️ Status', value: '`Received & Under Coordinated Review`', inline: false }
            ])
            .setFooter({ text: `Verified by Wnode Security — ${new Date().toUTCString()}` })
            .setTimestamp();

        try {
            await message.channel.send({
                content: `<@${message.author.id}> Thank you for your report. Our security team (${roleMention}) has received it and will review shortly.`,
                embeds: [ackEmbed]
            });

            // Store in state
            const report: VulnerabilityReport = {
                id: reportId,
                reporterId: message.author.id,
                reporterTag: message.author.tag,
                messageId: message.id,
                severity: analysis.severity,
                keywordsDetected: analysis.keywords,
                wasDeleted,
                timestamp: new Date().toISOString()
            };
            this.state.reports[reportId] = report;
            this.saveState();

            // Log Audit Pulse
            await this.logPulseAudit(report);
            console.log(`[ResponsibleDisclosureEngine] ✅ Processed security report ${reportId} from ${message.author.tag}`);
        } catch (err) {
            console.error('[ResponsibleDisclosureEngine] Failed to acknowledge disclosure report:', err);
        }
    }

    // 4. Audit Log to /api/v1/system/pulse
    private async logPulseAudit(report: VulnerabilityReport): Promise<void> {
        try {
            const apiUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
            await fetch(`${apiUrl}/api/v1/system/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'vulnerability_report_received',
                    report_id: report.id,
                    reporter_id: report.reporterId,
                    severity: report.severity,
                    was_deleted: report.wasDeleted,
                    timestamp: report.timestamp,
                    source: 'discord_responsible_disclosure'
                })
            });
        } catch (err) {
            console.error('[ResponsibleDisclosureEngine] Failed to log pulse audit:', err);
        }
    }
}
