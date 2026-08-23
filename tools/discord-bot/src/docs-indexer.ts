import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

export interface DocArticle {
    filePath: string;
    relativePath: string;
    title: string;
    section: string;
    content: string;
    url: string;
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
        console.log(`[DocsIndexer] Indexed ${this.articles.size} canonical documentation pages.`);
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
            
            // Extract Title from First Heading
            const titleMatch = rawContent.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md');
            
            // Determine Section Category
            const pathParts = relativePath.split(path.sep);
            const section = pathParts.length > 1 ? pathParts[0] : 'root';
            
            // Format Web URL
            const webPath = relativePath.replace(/\.md$/, '').replace(/README$/, '');
            const url = `https://wnode.one/docs/${webPath}`;

            this.articles.set(relativePath, {
                filePath,
                relativePath,
                title,
                section,
                content: rawContent,
                url
            });
        } catch (err) {
            console.error(`[DocsIndexer] Failed to index file ${filePath}:`, err);
        }
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

        console.log('[DocsIndexer] Live filesystem watcher initialized for /docs/**');
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
            let score = 0;

            for (const term of terms) {
                if (titleLower.includes(term)) score += 10;
                
                // Count occurrences in content
                const occurrences = (contentLower.match(new RegExp(term, 'g')) || []).length;
                score += occurrences;
            }

            if (score > 0) {
                // Extract Snippet around first match
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

                results.push({ article, score, snippet });
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
