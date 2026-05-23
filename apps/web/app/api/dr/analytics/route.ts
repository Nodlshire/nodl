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

        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

        // Metrics
        const totalInvites = invites.length;
        const activeInvitees = invites.filter(i => i.status === 'active' || i.status === 'nda_accepted').length;
        const logins7d = invites.filter(i => i.lastLogin && new Date(i.lastLogin).getTime() > sevenDaysAgo).length;

        const docViews = activities.filter(a => a.action === 'preview' && a.fileType !== 'link').length;
        const downloads = activities.filter(a => a.action === 'download').length;
        const linkOpens = activities.filter(a => a.action === 'link_opened').length;

        // Funnel
        const funnel = {
            invited: invites.length,
            opened: invites.filter(i => i.status !== 'invited').length, // assume if status advanced, they opened
            otpVerified: invites.filter(i => ['otp_verified', 'nda_accepted', 'active'].includes(i.status)).length,
            ndaAccepted: invites.filter(i => ['nda_accepted', 'active'].includes(i.status)).length,
            active: invites.filter(i => i.status === 'active').length,
            signed: 0 // Will compute from activities if we log 'agreement_signed', or from agreements DB.
            // Wait, we can parse agreements.json to get signatures!
        };

        // Let's get agreements
        let signedAgreements = 0;
        let agreementsViewed = 0; // Not strictly tracked as separate action unless 'preview' matches an agreement.
        try {
            const agrPath = path.join(process.cwd(), 'storage', 'agreements');
            const files = await fs.readdir(agrPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(agrPath, file), 'utf-8');
                    const agr = JSON.parse(data);
                    if (agr.status === 'fully_signed') signedAgreements++;
                }
            }
        } catch {}
        funnel.signed = signedAgreements;

        return NextResponse.json({
            metrics: {
                totalInvites,
                activeInvitees,
                logins7d,
                docViews,
                downloads,
                linkOpens,
                agreementsSigned: signedAgreements
            },
            funnel
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
