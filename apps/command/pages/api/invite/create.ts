import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { slot, email } = req.body;

    if (!slot || !email) {
        return res.status(400).json({ message: 'Missing slot or email' });
    }

    try {
        const apiUrl = process.env.API_URL || 'http://127.0.0.1:8080';
        
        // Fetch invite token from the Go backend (SOT)
        const response = await fetch(`${apiUrl}/api/v1/admin/founder/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || '',
            },
            body: JSON.stringify({ slot: parseInt(slot.toString(), 10) })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend error: ${errorText}`);
        }

        const data = await response.json();
        const wuid = data.token || '100001-0426-01-AA';
        const inviteUrl = `https://nodlr.wnode.one/invite?code=${wuid}`;

        return res.status(200).json({ 
            success: true, 
            wuid: wuid,
            inviteUrl: inviteUrl,
            message: `Universal invite link created: ${inviteUrl}` 
        });
    } catch (error) {
        console.error('Failed to create invite link:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
