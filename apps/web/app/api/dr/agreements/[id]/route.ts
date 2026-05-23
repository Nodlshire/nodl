import { NextRequest, NextResponse } from 'next/server';
import { getAgreement, saveAgreement } from '../../../../../lib/db/agreements';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const agreement = await getAgreement(id);
        if (!agreement) {
            return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
        }
        return NextResponse.json({ agreement });
    } catch (error) {
        console.error('Get agreement error:', error);
        return NextResponse.json({ error: 'Failed to get agreement' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const data = await req.json();
        
        const agreement = await getAgreement(id);
        if (!agreement) {
            return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
        }

        // Allow updating specific fields
        if (data.status) agreement.status = data.status;
        if (data.ownerSignatureId) agreement.ownerSignatureId = data.ownerSignatureId;
        if (data.ownerSignedAt) agreement.ownerSignedAt = data.ownerSignedAt;
        if (data.counterpartySignatureId) agreement.counterpartySignatureId = data.counterpartySignatureId;
        if (data.counterpartySignedAt) agreement.counterpartySignedAt = data.counterpartySignedAt;
        if (data.finalPdfFileId) agreement.finalPdfFileId = data.finalPdfFileId;

        await saveAgreement(agreement);

        return NextResponse.json({ agreement });
    } catch (error) {
        console.error('Update agreement error:', error);
        return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
    }
}
