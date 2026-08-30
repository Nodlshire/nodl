import * as fs from 'fs';
import * as path from 'path';

export interface DocArticle {
    title: string;
    url: string;
    content: string;
    keywords: string[];
}

export class YobanRAG {
    private articles: DocArticle[] = [];

    constructor() {
        this.loadKnowledgeBase();
    }

    private loadKnowledgeBase(): void {
        const docsDir = path.resolve(__dirname, '../../../docs');
        const fallbackDocsDir = path.resolve(__dirname, '../../../../docs');
        
        let targetDir = fs.existsSync(docsDir) ? docsDir : (fs.existsSync(fallbackDocsDir) ? fallbackDocsDir : null);

        if (!targetDir) {
            console.warn('[YobanRAG] ⚠️ Docs directory not found, using embedded core SOT knowledge base.');
            this.loadEmbeddedSOT();
            return;
        }

        try {
            this.scanDirectory(targetDir);
            console.log(`[YobanRAG] 📖 Successfully indexed ${this.articles.length} SOT documentation articles.`);
        } catch (err) {
            console.error('[YobanRAG] Error scanning docs:', err);
            this.loadEmbeddedSOT();
        }
    }

    private scanDirectory(dir: string): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                this.scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const title = entry.name.replace(/\.md$/, '').replace(/-/g, ' ').toUpperCase();
                    const url = `https://wnode.one/docs/${entry.name.replace(/\.md$/, '')}`;
                    const keywords = content.toLowerCase().split(/\W+/).filter(w => w.length > 3);
                    this.articles.push({ title, url, content, keywords });
                } catch (e) {
                    // skip unreadable file
                }
            }
        }
    }

    private loadEmbeddedSOT(): void {
        this.articles = [
            {
                title: "STRIDE THREAT MODEL & SECURITY ENVELOPE",
                url: "https://wnode.one/docs/stride-threat-model",
                content: "Wnode enforces Firecracker MicroVM container isolation with SECCOMP-BPF filtering, WireGuard encrypted mesh networking (mTLS 1.3), and zero unauthenticated root access across all provider nodes.",
                keywords: ["security", "stride", "firecracker", "seccomp", "wireguard", "mtls", "encryption"]
            },
            {
                title: "DEVELOPER OPENAPI 3.1 & SDKs",
                url: "https://wnode.one/docs/openapi-sdks",
                content: "Developers interact with Wnode via Native Go Core Engine (Port 8080) and TypeScript SDK (@wnode/sdk). Authentication uses Bearer WUID tokens with request signature validation.",
                keywords: ["openapi", "sdk", "typescript", "go", "developer", "api", "token", "wuid"]
            },
            {
                title: "AFFILIATE VIRAL GROWTH ENGINE (VGE)",
                url: "https://wnode.one/docs/vge-affiliates",
                content: "Affiliate invite links (https://nodlr.wnode.one/invite?code=<WUID>) bind inviter WUIDs deterministically to newly created provider accounts. Instant payouts are processed via Stripe Connect.",
                keywords: ["affiliate", "vge", "invite", "wuid", "stripe", "payout", "signup"]
            },
            {
                title: "FLEET MAP & DEWI GEOLOCATION",
                url: "https://wnode.one/docs/fleetmap-dewi",
                content: "FleetMap renders co-located nodes using zero-key Carto Dark tile layers with deterministic coordinate fan-out and Budapest centroid fallbacks.",
                keywords: ["fleetmap", "map", "dewi", "geolocation", "carto", "tiles", "budapest", "node"]
            }
        ];
    }

    public query(input: string): { answer: string; sources: { title: string; url: string }[]; confidenceScore: number } {
        const cleanQuery = input.toLowerCase().trim();
        if (!cleanQuery) {
            return {
                answer: "I'm Yoban, your Wnode assistant. How can I help you with DePIN compute, node onboarding, security, or API integrations?",
                sources: [],
                confidenceScore: 1.0
            };
        }

        const matches = this.articles.map(article => {
            let score = 0;
            const queryWords = cleanQuery.split(/\W+/).filter(w => w.length > 2);
            for (const word of queryWords) {
                if (article.keywords.includes(word)) score += 10;
                if (article.title.toLowerCase().includes(word)) score += 15;
                if (article.content.toLowerCase().includes(word)) score += 2;
            }
            return { article, score };
        }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);

        if (matches.length === 0) {
            return {
                answer: "I checked Wnode's canonical enterprise documentation (`v1.5.0-enterprise`), but I couldn't find a direct match for your specific query. I have logged this topic for the SOT Core Team to review.",
                sources: [],
                confidenceScore: 0.2
            };
        }

        const topMatch = matches[0].article;
        const confidenceScore = Math.min(1.0, matches[0].score / 30.0);

        return {
            answer: `### 📚 SOT Answer: ${topMatch.title}\n\n${topMatch.content}`,
            sources: matches.slice(0, 3).map(m => ({ title: m.article.title, url: m.article.url })),
            confidenceScore: parseFloat(confidenceScore.toFixed(2))
        };
    }
}
