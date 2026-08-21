import os

files_to_501 = [
    'apps/command/app/api/affiliates/all/route.ts',
    'apps/command/app/api/affiliates/stats/route.ts',
    'apps/command/app/api/clients/[id]/route.ts',
    'apps/command/app/api/nodlrs/[id]/route.ts',
    'apps/command/app/api/providers/me/route.ts',
    'apps/command/app/api/r/[code]/route.ts'
]

template_501 = """import { NextResponse } from 'next/server';

export async function GET() {
    // Simulation has been removed. Ensure real-time telemetry only.
    return NextResponse.json({ error: 'Endpoint relies on real data which is currently unavailable' }, { status: 501 });
}
"""

for f in files_to_501:
    if os.path.exists(f):
        with open(f, 'w') as fh:
            fh.write(template_501)
        print(f"Rewrote {f} to 501")

