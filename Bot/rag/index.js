import { chunkKnowledgeBase } from './chunker.js';
import { buildVectorStore, searchStore } from './store.js';
import { generateAnswer } from './answer.js';

export async function initRAG(knowledgeBase) {
    console.log("Initializing RAG pipeline...");
    const chunks = chunkKnowledgeBase(knowledgeBase, 700, 150);
    console.log(`Created ${chunks.length} chunks from knowledge base.`);
    
    await buildVectorStore(chunks);
    console.log("RAG pipeline initialization complete.");
}

export async function askQuestion(userQuestion) {
    console.log(`Processing RAG query: "${userQuestion}"`);
    
    const topChunks = await searchStore(userQuestion, 5);
    
    if (topChunks.length > 0) {
        const fileNames = [...new Set(topChunks.map(c => c.file))].join(', ');
        console.log(`Retrieved context from: ${fileNames}`);
    } else {
        console.log("No relevant chunks found.");
    }

    const answer = await generateAnswer(userQuestion, topChunks);
    return answer;
}
