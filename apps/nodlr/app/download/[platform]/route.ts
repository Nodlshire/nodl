import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ platform: string }> }
) {
    const { platform } = await context.params;
    const version = "v1.0.0";
    
    const assetMap: Record<string, string> = {
        'linux': `nodl-core-linux-amd64`,
        'linux-arm64': `nodl-core-linux-arm64`,
        'windows': `nodl-core-windows-amd64.exe`,
        'mac': `nodl-core-darwin-universal`,
        'android': `nodl-core-android-arm64.apk`,
        'cli': `nodl-core-linux-amd64`
    };

    const assetName = assetMap[platform.toLowerCase()] || `nodl-core-linux-amd64`;
    const cdnUrl = `https://github.com/wnodeltd/wnode/releases/download/${version}/${assetName}`;

    return NextResponse.redirect(cdnUrl, 307);
}
