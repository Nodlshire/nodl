import fs from 'fs/promises';
import path from 'path';

export interface Invite {
    id: string;
    email: string | null;
    createdAt: string;
    inviteType: 'email' | 'link';
    status: 'invited' | 'otp_verified' | 'nda_accepted' | 'active';
    lastLogin: string | null;
    activity: string[]; // UUIDs of activity logs if we want, but activity.json tracks inviteId
}

const INVITES_PATH = path.join(process.cwd(), 'storage', 'invites.json');

export async function getInvites(): Promise<Invite[]> {
    try {
        const data = await fs.readFile(INVITES_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function getInvite(id: string): Promise<Invite | null> {
    const invites = await getInvites();
    return invites.find(i => i.id === id) || null;
}

export async function getInviteByEmail(email: string): Promise<Invite | null> {
    const invites = await getInvites();
    return invites.find(i => i.email && i.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function saveInvite(invite: Invite): Promise<void> {
    const invites = await getInvites();
    const index = invites.findIndex(i => i.id === invite.id);
    if (index >= 0) {
        invites[index] = invite;
    } else {
        invites.push(invite);
    }
    await fs.mkdir(path.dirname(INVITES_PATH), { recursive: true });
    await fs.writeFile(INVITES_PATH, JSON.stringify(invites, null, 2));
}
