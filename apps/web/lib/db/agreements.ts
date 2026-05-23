import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export type AgreementStatus = 'draft' | 'awaiting_counterparty' | 'fully_signed' | 'cancelled';

export interface Agreement {
    id: string;
    title: string;
    status: AgreementStatus;
    ownerId: string; // user id (we'll use 'owner' for now)
    counterpartyEmail: string;
    templateFileId: string;
    filledFields: Record<string, string>;
    ownerSignatureId: string | null;
    counterpartySignatureId: string | null;
    ownerSignedAt: string | null; // ISO string
    counterpartySignedAt: string | null;
    finalPdfFileId: string | null;
    createdAt: string;
    updatedAt: string;
}

const AGREEMENTS_DIR = path.join(process.cwd(), 'storage', 'agreements');

async function ensureDir() {
    try {
        await fs.access(AGREEMENTS_DIR);
    } catch {
        await fs.mkdir(AGREEMENTS_DIR, { recursive: true });
    }
}

export async function getAgreement(id: string): Promise<Agreement | null> {
    await ensureDir();
    try {
        const data = await fs.readFile(path.join(AGREEMENTS_DIR, `${id}.json`), 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export async function listAgreements(ownerId?: string, counterpartyEmail?: string): Promise<Agreement[]> {
    await ensureDir();
    const files = await fs.readdir(AGREEMENTS_DIR);
    const agreements: Agreement[] = [];
    
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
            const data = await fs.readFile(path.join(AGREEMENTS_DIR, file), 'utf-8');
            const agreement: Agreement = JSON.parse(data);
            if (ownerId && agreement.ownerId !== ownerId) continue;
            if (counterpartyEmail && agreement.counterpartyEmail !== counterpartyEmail) continue;
            agreements.push(agreement);
        } catch (err) {
            console.error(`Failed to read agreement ${file}`, err);
        }
    }
    
    return agreements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveAgreement(agreement: Agreement): Promise<void> {
    await ensureDir();
    agreement.updatedAt = new Date().toISOString();
    await fs.writeFile(
        path.join(AGREEMENTS_DIR, `${agreement.id}.json`),
        JSON.stringify(agreement, null, 2)
    );
}

export async function createAgreement(data: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agreement> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const agreement: Agreement = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
    };
    await saveAgreement(agreement);
    return agreement;
}
