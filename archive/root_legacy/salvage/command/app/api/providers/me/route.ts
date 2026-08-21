import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET() {
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';

    if (isSimulated) {
        // Return Stephen Soos as the default 'me' for simulation
        const me = simulationState.nodlrs[0];
        if (!me) return NextResponse.json({ error: 'No simulation data' }, { status: 500 });

        return NextResponse.json({
            providerDetails: {
                id: me.id,
                email: me.email,
                name: me.name,
                role: me.role,
                crmMetadata: me.metadata
            }
        });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
