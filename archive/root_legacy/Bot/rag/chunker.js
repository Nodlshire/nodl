export function chunkKnowledgeBase(knowledgeBase, chunkSize = 700, overlap = 150) {
    const chunks = [];
    let chunkId = 0;

    for (const entry of knowledgeBase) {
        if (!entry.content) continue;
        
        const text = entry.originalContent;
        let startIndex = 0;
        let chunkIndex = 0;

        while (startIndex < text.length) {
            let endIndex = startIndex + chunkSize;
            
            // Adjust boundary to avoid cutting words
            if (endIndex < text.length) {
                const prevSpace = text.lastIndexOf(' ', endIndex);
                if (prevSpace > startIndex && (endIndex - prevSpace) < 100) {
                    endIndex = prevSpace;
                }
            } else {
                endIndex = text.length;
            }

            const chunkText = text.substring(startIndex, endIndex).trim();
            if (chunkText.length > 0) {
                chunks.push({
                    id: chunkId++,
                    file: entry.file,
                    chunkIndex: chunkIndex++,
                    text: chunkText
                });
            }

            startIndex = endIndex - overlap;
            
            // Ensure we move forward
            if (endIndex >= text.length) {
                break;
            }
        }
    }

    return chunks;
}
