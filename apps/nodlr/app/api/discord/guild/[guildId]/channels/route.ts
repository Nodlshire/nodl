import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const { guildId } = await params;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    // Graceful fallback to stub if token is missing
    return NextResponse.json([
      { id: '1', name: 'governance-announcements', type: 0 },
      { id: '2', name: 'proposal-discussion', type: 0 }
    ]);
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch channels' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
