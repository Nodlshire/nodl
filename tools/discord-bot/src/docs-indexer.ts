import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

export interface QAMetadata {
    id: string;
    question: string;
    tags: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    canonical: boolean;
    confidenceScore: number;
    author?: string;
    embeddingHash?: string;
}

export interface DocArticle {
    filePath: string;
    relativePath: string;
    title: string;
    section: string;
    content: string;
    url: string;
    isQA?: boolean;
    qaMetadata?: QAMetadata;
}

export class DocsIndexer {
    private docsDir: string;
    private articles: Map<string, DocArticle> = new Map();
    private onChangeCallback?: (changedFile: string, changeType: 'add' | 'change' | 'unlink') => void;

    constructor(docsDir: string) {
        this.docsDir = path.resolve(docsDir);
        this.buildIndex();
    }

    public buildIndex(): void {
        console.log(`[DocsIndexer] Indexing documentation tree at: ${this.docsDir}`);
        this.articles.clear();
        this.scanDirectory(this.docsDir);
        console.log(`[DocsIndexer] Indexed ${this.articles.size} documentation & Q&A pages.`);
    }

    private scanDirectory(dir: string): void {
        if (!fs.existsSync(dir)) return;

        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'archive' || entry.name === 'node_modules' || entry.name === '.git') continue;
                this.scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                this.indexFile(fullPath);
            }
        }
    }

    private indexFile(filePath: string): void {
        try {
            const rawContent = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(this.docsDir, filePath);
            
            // Check if file is a Q&A entry in /docs/qa/
            const isQA = relativePath.startsWith('qa') || relativePath.includes(`${path.sep}qa${path.sep}`);
            let qaMetadata: QAMetadata | undefined = undefined;
            let cleanContent = rawContent;
            let title = path.basename(filePath, '.md');

            // Parse YAML Frontmatter if present
            if (rawContent.startsWith('---')) {
                const parts = rawContent.split('---');
                if (parts.length >= 3) {
                    const frontmatterStr = parts[1].trim();
                    cleanContent = parts.slice(2).join('---').trim();

                    qaMetadata = this.parseFrontmatter(frontmatterStr);
                    if (qaMetadata && qaMetadata.question) {
                        title = qaMetadata.question;
                    }
                }
            }

            if (!title || title === path.basename(filePath, '.md')) {
                const titleMatch = cleanContent.match(/^#\s+(.+)$/m);
                if (titleMatch) title = titleMatch[1].trim();
            }

            const pathParts = relativePath.split(path.sep);
            const section = pathParts.length > 1 ? pathParts[0] : 'root';
            const webPath = relativePath.replace(/\.md$/, '').replace(/README$/, '');
            const url = `https://wnode.one/docs/${webPath}`;

            this.articles.set(relativePath, {
                filePath,
                relativePath,
                title,
                section,
                content: cleanContent,
                url,
                isQA,
                qaMetadata
            });
        } catch (err) {
            console.error(`[DocsIndexer] Failed to index file ${filePath}:`, err);
        }
    }

    private parseFrontmatter(str: string): QAMetadata | undefined {
        try {
            const lines = str.split('\n');
            const meta: any = {};
            for (const line of lines) {
                const colonIdx = line.indexOf(':');
                if (colonIdx === -1) continue;
                const key = line.slice(0, colonIdx).trim();
                let val = line.slice(colonIdx + 1).trim();

                // Unquote strings
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1);
                }

                // Parse booleans and numbers
                if (val === 'true') val = true as any;
                else if (val === 'false') val = false as any;
                else if (!isNaN(Number(val)) && val !== '') val = Number(val) as any;
                // Parse simple arrays e.g. ["tag1", "tag2"]
                else if (val.startsWith('[') && val.endsWith(']')) {
                    try {
                        val = JSON.parse(val);
                    } catch (e) {
                        val = val.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^['"]|['"]$/g, '')) as any;
                    }
                }

                meta[key] = val;
            }

            if (meta.id || meta.question) {
                return {
                    id: meta.id || `qa-${Date.now()}`,
                    question: meta.question || '',
                    tags: Array.isArray(meta.tags) ? meta.tags : [],
                    category: meta.category || 'general',
                    createdAt: meta.created_at || new Date().toISOString(),
                    updatedAt: meta.updated_at || new Date().toISOString(),
                    canonical: meta.canonical === true,
                    confidenceScore: typeof meta.confidence_score === 'number' ? meta.confidence_score : 1.0,
                    author: meta.author,
                    embeddingHash: meta.embedding_hash
                };
            }
        } catch (e) {
            console.error('[DocsIndexer] Error parsing frontmatter:', e);
        }
        return undefined;
    }

    public startWatcher(onNotify: (changedFile: string, changeType: 'add' | 'change' | 'unlink') => void): void {
        this.onChangeCallback = onNotify;
        const watcher = chokidar.watch(this.docsDir, {
            ignored: /(^|[\/\\])(\..|archive)/,
            persistent: true,
            ignoreInitial: true
        });

        watcher.on('add', (filePath) => this.handleFileSystemEvent(filePath, 'add'));
        watcher.on('change', (filePath) => this.handleFileSystemEvent(filePath, 'change'));
        watcher.on('unlink', (filePath) => this.handleFileSystemEvent(filePath, 'unlink'));

        console.log('[DocsIndexer] Live filesystem watcher initialized for /docs/** (Canonical + Q&A)');
    }

    private handleFileSystemEvent(filePath: string, eventType: 'add' | 'change' | 'unlink'): void {
        if (!filePath.endsWith('.md')) return;
        const relativePath = path.relative(this.docsDir, filePath);

        if (eventType === 'unlink') {
            this.articles.delete(relativePath);
        } else {
            this.indexFile(filePath);
        }

        console.log(`[DocsIndexer] Docs update detected [${eventType}]: ${relativePath}`);
        if (this.onChangeCallback) {
            this.onChangeCallback(relativePath, eventType);
        }
    }

    public getArticles(): DocArticle[] {
        return Array.from(this.articles.values());
    }

    public search(query: string): { article: DocArticle; score: number; snippet: string }[] {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
        if (terms.length === 0) return [];

        const results: { article: DocArticle; score: number; snippet: string }[] = [];

        for (const article of this.articles.values()) {
            const contentLower = article.content.toLowerCase();
            const titleLower = article.title.toLowerCase();
            let baseScore = 0;

            for (const term of terms) {
                if (titleLower.includes(term)) baseScore += 10;
                
                if (article.qaMetadata && article.qaMetadata.tags) {
                    const hasTagMatch = article.qaMetadata.tags.some(t => t.toLowerCase().includes(term));
                    if (hasTagMatch) baseScore += 15;
                }

                const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
                baseScore += occurrences;
            }

            if (baseScore > 0) {
                // Canonical Prioritization Multiplier (2.5x boost for verified SOT Q&A entries)
                const isCanonical = article.qaMetadata?.canonical ?? false;
                const confidenceFactor = article.qaMetadata?.confidenceScore ?? 1.0;
                const finalScore = baseScore * (isCanonical ? 2.5 : 1.0) * confidenceFactor;

                const firstTerm = terms[0];
                const index = contentLower.indexOf(firstTerm);
                let snippet = '';
                if (index !== -1) {
                    const start = Math.max(0, index - 80);
                    const end = Math.min(article.content.length, index + 120);
                    snippet = '...' + article.content.substring(start, end).replace(/\n/g, ' ') + '...';
                } else {
                    snippet = article.content.substring(0, 150).replace(/\n/g, ' ') + '...';
                }

                results.push({ article, score: finalScore, snippet });
            }
        }

        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    public getArticleBySlug(slug: string): DocArticle | undefined {
        for (const [relPath, article] of this.articles.entries()) {
            if (relPath.toLowerCase().includes(slug.toLowerCase()) || article.title.toLowerCase().includes(slug.toLowerCase())) {
                return article;
            }
        }
        return undefined;
    }
}
