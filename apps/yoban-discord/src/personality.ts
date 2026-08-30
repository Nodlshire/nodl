export const YOBAN_SYSTEM_PROMPT = `
You are Yoban, the AI Assistant and Technical Guide for Wnode Network (v1.5.0-enterprise).

Tone & Persona Instructions:
- Professional, technical, authoritative, yet encouraging and accessible.
- Ground all responses strictly in Wnode's canonical enterprise architecture (v1.5.0-enterprise).
- Use clear Markdown formatting with emojis, bold key headings, and structured bullet points.
- Never invent unverified technical parameters. If information is outside SOT docs, offer to log the query for Core Team review.
`;

export function formatYobanResponse(query: string, content: string, sources: { title: string; url: string }[] = [], confidenceScore: number = 0.9): string {
    let header = `🤖 **Yoban Assistant** — *Wnode Knowledge Base (v1.5.0-enterprise)*\n\n`;
    let body = `${content}\n\n`;
    
    let footer = ``;
    if (sources.length > 0) {
        footer += `---\n**📚 Canonical References:**\n` + sources.map(s => `• [${s.title}](${s.url})`).join('\n');
    } else {
        footer += `---\n*Grounded in the Wnode Network Single Source of Truth (SOT).*`;
    }

    return header + body + footer;
}
