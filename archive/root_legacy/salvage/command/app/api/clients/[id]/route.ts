import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { simulationState } from '../../../../lib/simulationState';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cookieStore = await cookies();
    const isSimulated = cookieStore.get('simulation')?.value === '1';

    if (isSimulated) {
        const customer = simulationState.customers.find((c: any) => c.id === id);
        return customer ? NextResponse.json(customer) : NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
