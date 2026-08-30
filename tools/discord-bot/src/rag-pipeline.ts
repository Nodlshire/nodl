import { DocsIndexer, DocArticle } from './docs-indexer';

export interface RAGResponse {
    query: string;
    answer: string;
    confidenceScore: number;
    isCanonical: boolean;
    sources: { title: string; url: string; isQA: boolean }[];
    suggestsReview: boolean;
}

export class UnifiedRAGPipeline {
    private indexer: DocsIndexer;

    constructor(indexer: DocsIndexer) {
        this.indexer = indexer;
    }

    public processQuery(query: string): RAGResponse {
        const cleanQuery = query.trim();
        const searchResults = this.indexer.search(cleanQuery);

        if (searchResults.length === 0) {
            return {
                query: cleanQuery,
                answer: '❌ No direct match found in the Wnode SOT documentation. This query has been flagged for Core Team review.',
                confidenceScore: 0.0,
                isCanonical: false,
                sources: [],
                suggestsReview: true
            };
        }

        const topResult = searchResults[0];
        const isCanonical = topResult.article.qaMetadata?.canonical ?? false;
        
        // Calculate Confidence Score (Normalized between 0.0 and 1.0)
        let rawConfidence = Math.min(1.0, topResult.score / 50.0);
        if (isCanonical) {
            rawConfidence = Math.min(1.0, rawConfidence + 0.35);
        }
        const confidenceScore = parseFloat(rawConfidence.toFixed(2));

        const sources = searchResults.map(r => ({
            title: r.article.title,
            url: r.article.url,
            isQA: r.article.isQA ?? false
        }));

        let answer = '';
        const suggestsReview = confidenceScore < 0.85;

        if (confidenceScore >= 0.85) {
            answer = `### 📚 SOT Answer: ${topResult.article.title}\n\n${topResult.article.content.trim()}\n\n---\n**Canonical Source:** [${topResult.article.title}](${topResult.article.url})`;
        } else {
            answer = `⚠️ **Draft Response (Confidence: ${(confidenceScore * 100).toFixed(0)}%):**\n\n${topResult.snippet}\n\n*This query is under review by the SOT Core Team for formal Q&A addition.*`;
        }

        return {
            query: cleanQuery,
            answer,
            confidenceScore,
            isCanonical,
            sources,
            suggestsReview
        };
    }
}
