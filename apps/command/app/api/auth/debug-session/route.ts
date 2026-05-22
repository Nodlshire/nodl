import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.NODLD_API_URL || "http://127.0.0.1:8081";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${apiUrl}/api/v1/auth/debug-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    // Create the response and forward the Set-Cookie header
    const response = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        response.headers.set('set-cookie', setCookie);
    }
    
    return response;
  } catch (error) {
    console.error('[Command debug-session proxy error]', error);
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}
