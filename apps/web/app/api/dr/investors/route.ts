import { NextRequest, NextResponse } from 'next/server';
import { getInvites } from '../../../../lib/db/invites';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
    try {
        const invites = await getInvites();
        
        let activities: any[] = [];
        try {
            const actPath = path.join(process.cwd(), 'storage', 'activity.json');
            const data = await fs.readFile(actPath, 'utf-8');
            activities = JSON.parse(data);
        } catch {}

        const investors = invites.map(invite => {
            const userActs = activities.filter(a => a.inviteId === invite.id || (invite.email && a.userEmail === invite.email));
            
            return {
                ...invite,
                stats: {
                    totalViews: userActs.filter(a => a.action === 'preview' && a.fileType !== 'link').length,
                    totalDownloads: userActs.filter(a => a.action === 'download').length,
                    linkOpens: userActs.filter(a => a.action === 'link_opened').length,
                    // Agreements signed is complex to calculate per user unless we read agreements.json
                    // For now, let's leave it at 0 or read agreements.
                    agreementsSigned: 0
                },
                activities: userActs.slice(-50).reverse() // Include recent activities for profile
            };
        });

        // Resolve agreements signed
        try {
            const agrPath = path.join(process.cwd(), 'storage', 'agreements');
            const files = await fs.readdir(agrPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(agrPath, file), 'utf-8');
                    const agr = JSON.parse(data);
                    if (agr.status === 'fully_signed') {
                        const inv = investors.find(i => i.email && i.email.toLowerCase() === agr.counterpartyEmail?.toLowerCase());
                        if (inv) inv.stats.agreementsSigned++;
                    }
                }
            }
        } catch {}

        return NextResponse.json({ investors });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch investors' }, { status: 500 });
    }
}
