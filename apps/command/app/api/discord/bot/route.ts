import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  
  if (!botToken) {
    return NextResponse.json({ error: 'DISCORD_BOT_TOKEN not configured' }, { status: 500 });
  }

  // Simple ping check or info fetch
  try {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Discord API error', status: response.status }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      status: 'online', 
      bot: data.username,
      ping: 'pong'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to Discord' }, { status: 500 });
  }
}
