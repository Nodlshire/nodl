import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const REGISTRY_PATH = path.resolve(__dirname, '../../../services/nodld/state/feedback-registry.json');
const ENGINE_STATE_PATH = path.resolve(__dirname, '../../../services/nodld/state/engine.json');

export interface FeedbackRecord {
    id: string;
    userId: string;
    username: string;
    channelName: string;
    content: string;
    contentHash: string;
    status: 'UNVERIFIED' | 'VERIFIED_BY_TELEMETRY' | 'VERIFIED_BY_CONSENSUS' | 'REJECTED';
    consensusTesters: string[];
    createdAt: string;
    updatedAt: string;
}

export class FeedbackEngine {
    private feedbackMap: Map<string, FeedbackRecord> = new Map();
    private lastFeedbackTimestamp: Map<string, number> = new Map();
    private lastBugReportTimestamp: Map<string, number> = new Map();
    private seenContentHashes: Set<string> = new Set();

    constructor() {
        this.loadRegistry();
    }

    private loadRegistry(): void {
        try {
            if (fs.existsSync(REGISTRY_PATH)) {
                const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
                const data: FeedbackRecord[] = JSON.parse(raw);
                for (const item of data) {
                    this.feedbackMap.set(item.id, item);
                    this.seenContentHashes.add(item.contentHash);
                }
            }
        } catch (err) {
            console.error('[FeedbackEngine] Failed to load registry:', err);
        }
    }

    private saveRegistry(): void {
        try {
            const dir = path.dirname(REGISTRY_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const data = Array.from(this.feedbackMap.values());
            fs.writeFileSync(REGISTRY_PATH, JSON.stringify(data, null, 2), 'utf-8');
        } catch (err) {
            console.error('[FeedbackEngine] Failed to save registry:', err);
        }
    }

    // 1. Role Verification Gate
    public static hasRequiredRole(member: any): boolean {
        if (!member || !member.roles) return false;
        const allowedRoles = ['Beta Tester', 'Operator Pro', 'Operator Spotlight', 'Mesh Pioneer', 'Telemetry Master', 'Core Team', 'Founder'];
        return member.roles.cache.some((r: any) => allowedRoles.includes(r.name));
    }

    // 2. Rate Limits & Anti-Spam
    public checkRateLimitAndSpam(userId: string, channelName: string, content: string): { allowed: boolean; reason?: string } {
        const now = Date.now();
        const contentHash = crypto.createHash('sha256').update(content.trim().toLowerCase()).digest('hex');

        // Deduplication Check
        if (this.seenContentHashes.has(contentHash)) {
            return { allowed: false, reason: 'Duplicate content blocked by anti-spam filter.' };
        }

        // Channel Rate Limit Check
        if (channelName === 'beta-bugs') {
            const lastBug = this.lastBugReportTimestamp.get(userId) || 0;
            if (now - lastBug < 60 * 60 * 1000) { // 1 Hour limit
                const remainingMins = Math.ceil((60 * 60 * 1000 - (now - lastBug)) / 60000);
                return { allowed: false, reason: `Rate limit: 1 bug report per hour. Try again in ${remainingMins} minutes.` };
            }
        } else if (channelName === 'beta-feedback') {
            const lastFeedback = this.lastFeedbackTimestamp.get(userId) || 0;
            if (now - lastFeedback < 10 * 60 * 1000) { // 10 Minutes limit
                const remainingMins = Math.ceil((10 * 60 * 1000 - (now - lastFeedback)) / 60000);
                return { allowed: false, reason: `Rate limit: 1 feedback per 10 minutes. Try again in ${remainingMins} minutes.` };
            }
        }

        return { allowed: true };
    }

    // 3. Process Feedback & Telemetry Cross-Verification
    public processFeedback(userId: string, username: string, channelName: string, content: string): { record: FeedbackRecord; isVerified: boolean } {
        const now = Date.now();
        const contentHash = crypto.createHash('sha256').update(content.trim().toLowerCase()).digest('hex');

        if (channelName === 'beta-bugs') {
            this.lastBugReportTimestamp.set(userId, now);
        } else {
            this.lastFeedbackTimestamp.set(userId, now);
        }

        this.seenContentHashes.add(contentHash);

        const isTelemetryConfirmed = this.crossVerifyWithTelemetry(content);
        const initialStatus = isTelemetryConfirmed ? 'VERIFIED_BY_TELEMETRY' : 'UNVERIFIED';

        const record: FeedbackRecord = {
            id: `fb_${Date.now()}_${userId.slice(-4)}`,
            userId,
            username,
            channelName,
            content,
            contentHash,
            status: initialStatus,
            consensusTesters: [userId],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.feedbackMap.set(record.id, record);
        this.saveRegistry();

        console.log(`[FeedbackEngine] Logged feedback ${record.id} from ${username} in #${channelName} [Status: ${record.status}]`);
        return { record, isVerified: isTelemetryConfirmed };
    }

    // 4. Multi-Tester Consensus (3 Testers Required for Escalation)
    public endorseFeedback(feedbackId: string, testerUserId: string): { record: FeedbackRecord | null; reachedConsensus: boolean } {
        const record = this.feedbackMap.get(feedbackId);
        if (!record) return { record: null, reachedConsensus: false };

        if (!record.consensusTesters.includes(testerUserId)) {
            record.consensusTesters.push(testerUserId);
            record.updatedAt = new Date().toISOString();

            if (record.consensusTesters.length >= 3 && record.status === 'UNVERIFIED') {
                record.status = 'VERIFIED_BY_CONSENSUS';
                this.saveRegistry();
                console.log(`[FeedbackEngine] 🎉 Issue ${record.id} reached 3-tester consensus! Escalating.`);
                return { record, reachedConsensus: true };
            }

            this.saveRegistry();
        }

        return { record, reachedConsensus: record.status === 'VERIFIED_BY_CONSENSUS' };
    }

    // Telemetry Cross-Verification Helper against nodld engine.json
    private crossVerifyWithTelemetry(content: string): boolean {
        try {
            if (fs.existsSync(ENGINE_STATE_PATH)) {
                const raw = fs.readFileSync(ENGINE_STATE_PATH, 'utf-8');
                const parsed = JSON.parse(raw);
                if (parsed.nodes) {
                    const text = content.toLowerCase();
                    // Check if report mentions specific telemetry metrics (RAM, CPU, port 8080, nodld)
                    if (text.includes('nodld') || text.includes('telemetry') || text.includes('cpu') || text.includes('ram') || text.includes('port 8080')) {
                        return true;
                    }
                }
            }
        } catch (err) {
            console.error('[FeedbackEngine] Telemetry verification error:', err);
        }
        return false;
    }

    // 5. Channel Intro & Template Pin Management
    public async ensureBetaFeedbackIntro(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'beta-feedback' || c.id === '1540912048873934940');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'beta-feedback' || c?.id === '1540912048873934940');
        }
        if (!channel) return;

        const introText =
            '🧪 **Welcome to #beta‑feedback!**\n' +
            'This channel is dedicated to feedback and discussion for Wnode Public Beta releases.\n' +
            'Your insights help refine stability, performance, and usability before production rollout.\n\n' +
            '**How to Contribute:**\n' +
            '• Test the latest Beta release candidate.\n' +
            '• Report bugs, UI issues, or unexpected behavior.\n' +
            '• Suggest improvements or feature adjustments.\n' +
            '• Share performance metrics or system logs if relevant.\n\n' +
            'All feedback here is reviewed by the Core Team and logged for analysis.';

        const templateText =
            '📋 **Wnode Beta Feedback Template**\n\n' +
            '**Component / Feature:** [e.g., Dashboard UI, Node Telemetry, CLI]\n' +
            '**Release Candidate / Version:** [e.g., v1.0.0-rc.2]\n' +
            '**OS / Environment:** [e.g., Ubuntu 22.04 LTS, Docker, macOS]\n' +
            '**Feedback Summary:** [Clear, concise description]\n' +
            '**Reproduction Steps / Metrics:** [Steps to reproduce or relevant metrics/logs]';

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingIntro = null;
            let existingTemplate = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #beta‑feedback')) existingIntro = msg;
                    if (msg.content.includes('Wnode Beta Feedback Template')) existingTemplate = msg;
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

            console.log('[FeedbackEngine] ✅ Ensured #beta-feedback intro and template pins.');
        } catch (err) {
            console.error('[FeedbackEngine] Failed to pin #beta-feedback headers:', err);
        }
    }

    public async ensureBetaBugsIntro(guild: any): Promise<void> {
        let channel = guild.channels.cache.find((c: any) => c.name === 'beta-bugs' || c.id === '1540912050337742939');
        if (!channel) {
            const channels = await guild.channels.fetch().catch(() => new Map());
            channel = channels.find((c: any) => c?.name === 'beta-bugs' || c?.id === '1540912050337742939');
        }
        if (!channel) return;

        const introText =
            '🐞 **Welcome to #beta‑bugs!**\n' +
            'This channel is for structured bug reporting and telemetry submissions during Wnode Public Beta testing.\n' +
            'Please use the format below to ensure your report is clear and actionable.\n\n' +
            '**How to Report a Bug:**\n' +
            '• Confirm you’re using the latest Beta release candidate.\n' +
            '• Describe the issue precisely and include reproduction steps.\n' +
            '• Attach logs or screenshots if available.\n' +
            '• Tag `@Core Team` only for critical issues.\n\n' +
            'All bug reports are logged and reviewed by QA and telemetry engineers.';

        const templateText =
            '📋 **Wnode Beta Bug Report Template**\n\n' +
            '**Issue Title:** [Short descriptive title]\n' +
            '**Release Candidate / Version:** [e.g., v1.0.0-rc.2]\n' +
            '**Environment / OS:** [e.g., Ubuntu 22.04 LTS, Docker, Windows WSL2]\n' +
            '**Severity:** Critical / Major / Minor\n' +
            '**Reproduction Steps:**\n' +
            '1. [Step 1]\n' +
            '2. [Step 2]\n' +
            '3. [Step 3]\n' +
            '**Expected Behavior:** [What should happen]\n' +
            '**Actual Behavior:** [What actually happened]\n' +
            '**Logs / Error Snippets:** [Relevant log output]';

        try {
            const pinnedMessages = await channel.messages.fetchPinned().catch(() => new Map());
            let existingIntro = null;
            let existingTemplate = null;

            for (const [id, msg] of pinnedMessages) {
                if (msg.author.id === guild.client.user.id) {
                    if (msg.content.includes('Welcome to #beta‑bugs')) existingIntro = msg;
                    if (msg.content.includes('Wnode Beta Bug Report Template')) existingTemplate = msg;
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

            console.log('[FeedbackEngine] ✅ Ensured #beta-bugs intro and template pins.');
        } catch (err) {
            console.error('[FeedbackEngine] Failed to pin #beta-bugs headers:', err);
        }
    }

    public getRegistry(): FeedbackRecord[] {
        return Array.from(this.feedbackMap.values());
    }
}
