import { NextRequest, NextResponse } from 'next/server';
import { runAiJob } from '@ai/ai_router';

export async function POST(req: NextRequest) {
  try {
    const { message, insight } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 });
    }

    // Format generation prompt prefix 'gen:' to route it to tiny-local generation adapter
    const prompt = `gen: You are Mesh Maestro, the AI assistant for Wnode. The user asks: "${message}" based on the system insight: "${insight || 'none'}". Generate a helpful, concise response.`;

    const job = {
      id: `chat-${Date.now()}`,
      type: 'generation',
      payload: {
        input: prompt
      }
    };

    const result = await runAiJob(job);
    
    if (result && result.status === 'ok' && result.data && result.data.completion) {
      return NextResponse.json({ reply: result.data.completion });
    }

    return NextResponse.json({ reply: 'I am online but couldn\'t process the query. Fallback response: All systems operational.' });
  } catch (err: any) {
    console.error('[Insight Chat Route Error]', err);
    return NextResponse.json({ reply: 'Error communicating with the local inference engine.' });
  }
}
