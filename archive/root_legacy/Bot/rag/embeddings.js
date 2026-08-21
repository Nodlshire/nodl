export async function embedText(text) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: text
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data[0].embedding;
    } catch (err) {
        console.error("Embedding error:", err);
        return null;
    }
}

export async function embedBatch(texts) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return texts.map(() => null);

    try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: texts
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data.map(d => d.embedding);
    } catch (err) {
        console.error("Batch embedding error:", err);
        return texts.map(() => null);
    }
}
