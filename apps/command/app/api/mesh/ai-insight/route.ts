import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const job = {
      id: `ui-insight-${Date.now()}`,
      type: 'score',
      payload: {
        meshHealth: 'optimal',
        integrityScore: 98,
        activeNodes: 24
      }
    };

    return NextResponse.json(job);
  } catch (err: any) {
    console.error('[AI API Error]', err);
    return NextResponse.json({
      status: 'error',
      error: err.message
    }, { status: 500 });
  }
}
