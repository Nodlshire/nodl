import { NextRequest, NextResponse } from 'next/server';
import { createAgreement, listAgreements } from '../../../../lib/db/agreements';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get('ownerId') || undefined;
        const counterpartyEmail = searchParams.get('counterpartyEmail') || undefined;

        const agreements = await listAgreements(ownerId, counterpartyEmail);
        return NextResponse.json({ agreements });
    } catch (error) {
        console.error('List agreements error:', error);
        return NextResponse.json({ error: 'Failed to list agreements' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        if (!data.title || !data.counterpartyEmail || !data.templateFileId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const agreement = await createAgreement({
            title: data.title,
            status: 'draft',
            ownerId: data.ownerId || 'owner',
            counterpartyEmail: data.counterpartyEmail.toLowerCase().trim(),
            templateFileId: data.templateFileId,
            filledFields: data.filledFields || {},
            ownerSignatureId: null,
            counterpartySignatureId: null,
            ownerSignedAt: null,
            counterpartySignedAt: null,
            finalPdfFileId: null
        });

        return NextResponse.json({ agreement });
    } catch (error) {
        console.error('Create agreement error:', error);
        return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
    }
}
