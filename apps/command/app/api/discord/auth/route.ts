import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${request.nextUrl.origin}/api/discord/auth/callback`);
  
  // This is a simple redirect to Discord OAuth2
  // In a real app, you'd handle the callback to exchange the code for a token
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;

  return NextResponse.redirect(discordAuthUrl);
}
