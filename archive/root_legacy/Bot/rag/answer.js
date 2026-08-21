export async function generateAnswer(userQuestion, topChunks) {
    if (!process.env.OPENAI_API_KEY) {
        // Fallback when LLM is not configured
        if (topChunks.length === 0) {
            return "I couldn't find any relevant information regarding that query in my knowledge base.";
        }
        const bestText = topChunks[0].text;
        const trimmed = bestText.length > 1800 ? bestText.substring(0, 1800) + "..." : bestText;
        return `*(raw context, no LLM available)*\n\nI found some relevant information in my knowledge base:\n\n${trimmed}`;
    }

    if (topChunks.length === 0) {
        return "I couldn't find any relevant information regarding that query in my knowledge base.";
    }

    const contextText = topChunks.map((chunk, index) => 
        `[Source ${index + 1}: ${chunk.file}]\n${chunk.text}`
    ).join('\n\n');

    const systemPrompt = `You are Wnode’s sovereign compute assistant. Answer using ONLY the provided context. Keep your answer short and direct (3-8 sentences). Do not hallucinate or guess. If the answer is not in the context, say you don't know.`;
    const userPrompt = `Context:\n${contextText}\n\nQuestion: ${userQuestion}`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o', // robust model for answer generation
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (err) {
        console.error("LLM Generation error:", err);
        return "I encountered an error while trying to formulate an answer.";
    }
}
