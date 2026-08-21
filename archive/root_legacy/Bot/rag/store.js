import { embedBatch, embedText } from './embeddings.js';

let vectorStore = [];
let embeddingsEnabled = false;

function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function buildVectorStore(chunks) {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("No OPENAI_API_KEY configured. Embeddings disabled. RAG will fall back to Fuse.js.");
        vectorStore = chunks.map(chunk => ({ ...chunk, embedding: null }));
        return false;
    }

    console.log(`Building vector store for ${chunks.length} chunks...`);
    embeddingsEnabled = true;
    
    // Process in batches of 100 to avoid API limits
    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map(c => c.text);
        
        try {
            const embeddings = await embedBatch(texts);
            for (let j = 0; j < batch.length; j++) {
                vectorStore.push({
                    ...batch[j],
                    embedding: embeddings[j]
                });
            }
            console.log(`Embedded ${Math.min(i + batchSize, chunks.length)} / ${chunks.length} chunks...`);
        } catch (err) {
            console.error("Failed to embed batch", err);
        }
    }

    console.log("Vector store build complete.");
    return true;
}

export async function searchStore(query, topK = 5) {
    if (!embeddingsEnabled || !process.env.OPENAI_API_KEY) {
        return [];
    }

    const queryEmbedding = await embedText(query);
    if (!queryEmbedding) return [];

    const scored = vectorStore
        .filter(doc => doc.embedding) // skip failed embeddings
        .map(doc => ({
            ...doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding)
        }))
        .sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
}
