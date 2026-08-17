import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest
) {
    const downloadUrl = new URL('/downloads/nodl-core', request.url);
    return NextResponse.redirect(downloadUrl, 307);
}
