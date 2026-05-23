import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface OTPRecord {
    email: string;
    hashedOtp: string;
    expiry: string; // ISO string
    attempts: number;
    ipAddress: string;
}

const OTP_DIR = path.join(process.cwd(), 'storage', 'otp');

async function ensureDir() {
    try {
        await fs.access(OTP_DIR);
    } catch {
        await fs.mkdir(OTP_DIR, { recursive: true });
    }
}

function getEmailHash(email: string) {
    return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
}

export async function saveOTP(record: OTPRecord): Promise<void> {
    await ensureDir();
    const filePath = path.join(OTP_DIR, `${getEmailHash(record.email)}.json`);
    await fs.writeFile(filePath, JSON.stringify(record, null, 2));
}

export async function getOTP(email: string): Promise<OTPRecord | null> {
    await ensureDir();
    const filePath = path.join(OTP_DIR, `${getEmailHash(email)}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export async function deleteOTP(email: string): Promise<void> {
    await ensureDir();
    const filePath = path.join(OTP_DIR, `${getEmailHash(email)}.json`);
    try {
        await fs.rm(filePath, { force: true });
    } catch {
        // ignore
    }
}
