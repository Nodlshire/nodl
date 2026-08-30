import fs from 'fs';
import path from 'path';
import { RAGResponse } from './rag-pipeline';

const { EmbedBuilder } = require('discord.js');

export interface ReviewTicket {
    id: string;
    query: string;
    category: string;
    confidenceScore: number;
    draftAnswer: string;
    authorId: string;
    createdAt: string;
}

export class QAFeedbackLoop {
    private docsDir: string;
    private tickets: Map<string, ReviewTicket> = new Map();

    constructor(docsDir: string) {
        this.docsDir = path.resolve(docsDir);
    }

    public async processLowConfidenceQuery(guild: any, ragResponse: RAGResponse, authorId: string): Promise<void> {
        const ticketId = `ticket-${Date.now()}`;
        const category = this.determineCategory(ragResponse.query);

        const ticket: ReviewTicket = {
            id: ticketId,
            query: ragResponse.query,
            category,
            confidenceScore: ragResponse.confidenceScore,
            draftAnswer: ragResponse.answer,
            authorId,
            createdAt: new Date().toISOString()
        };

        this.tickets.set(ticketId, ticket);

        // 1. Post to #moderators Channel
        const modChannel = guild.channels.cache.find((c: any) => c.name === 'moderators' || c.id === '1540912041387364404');
        if (modChannel) {
            const embed = new EmbedBuilder()
                .setTitle(`📌 Low Confidence Query Ticket: ${ticketId}`)
                .setColor(0xF59E0B) // Amber
                .setDescription(`**User Query:** "${ragResponse.query}"\n**Confidence Score:** ${(ragResponse.confidenceScore * 100).toFixed(0)}%`)
                .addFields([
                    { name: 'Suggested Category', value: `\`${category}\``, inline: true },
                    { name: 'Ticket ID', value: `\`${ticketId}\``, inline: true },
                    { name: 'Approve Command', value: `\`!approve-qa ${ticketId} [category]\``, inline: false }
                ])
                .setFooter({ text: 'Wnode SOT Autonomous QA Feedback Loop' })
                .setTimestamp();

            try {
                await modChannel.send({ embeds: [embed] });
            } catch (err) {
                console.error('[QAFeedbackLoop] Failed to post review ticket:', err);
            }
        }

        // 2. Pulse Audit Trace
        await this.logPulseAudit('qa_low_confidence_flagged', {
            ticket_id: ticketId,
            query: ragResponse.query,
            confidence_score: ragResponse.confidenceScore
        });
    }

    public async approveAndCreateQAFile(ticketId: string, categoryOverride?: string, customAnswer?: string): Promise<string | null> {
        const ticket = this.tickets.get(ticketId);
        if (!ticket) {
            console.error(`[QAFeedbackLoop] Ticket ${ticketId} not found.`);
            return null;
        }

        const category = categoryOverride || ticket.category || 'general';
        const slug = ticket.query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);
        const fileName = `${slug}.md`;
        const targetDir = path.join(this.docsDir, 'qa', category);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, fileName);
        const answerText = customAnswer || ticket.draftAnswer || `Answer to ${ticket.query}`;

        const fileContent = 
`---
id: ${ticketId}
question: "${ticket.query.replace(/"/g, '\\"')}"
tags: ["${category}", "${slug}"]
category: "${category}"
created_at: "${new Date().toISOString()}"
updated_at: "${new Date().toISOString()}"
canonical: true
confidence_score: 0.95
author: "SOT Staff Approval"
---

# ${ticket.query}

${answerText}

### Canonical References
- [Wnode Canonical SOT Documentation](https://wnode.one/docs/)
`;

        try {
            fs.writeFileSync(filePath, fileContent, 'utf-8');
            this.tickets.delete(ticketId);
            console.log(`[QAFeedbackLoop] Created canonical Q&A Markdown file at: ${filePath}`);

            await this.logPulseAudit('qa_file_created', {
                ticket_id: ticketId,
                file_path: filePath,
                category
            });

            return filePath;
        } catch (err) {
            console.error(`[QAFeedbackLoop] Failed to create Q&A file:`, err);
            return null;
        }
    }

    private determineCategory(query: string): string {
        const q = query.toLowerCase();
        if (q.includes('operator') || q.includes('node') || q.includes('install') || q.includes('setup')) return 'operator';
        if (q.includes('pay') || q.includes('usd') || q.includes('stripe') || q.includes('payout')) return 'payments';
        if (q.includes('ram') || q.includes('storage') || q.includes('mesh') || q.includes('cpu')) return 'infrastructure';
        if (q.includes('beta') || q.includes('tester') || q.includes('role') || q.includes('discord')) return 'community';
        if (q.includes('security') || q.includes('disclos') || q.includes('vulnerab') || q.includes('policy')) return 'policy';
        return 'operator';
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
                    source: 'qa_feedback_loop'
                })
            });
        } catch (e) {}
    }
}
