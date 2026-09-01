export interface NormalizedIdentity {
    id: string;
    displayName: string;
    initials: string;
    avatarUrl?: string;
    role?: string;
    permissions?: string[];
}

export function normalizeAccount(raw: any): NormalizedIdentity {
    if (!raw) {
        return {
            id: 'Unknown',
            displayName: 'Operator',
            initials: '?',
        };
    }

    const id = raw.id || raw.nodlrId || raw.wuid || 'Session Active';
    const displayName = raw.displayName || raw.name || raw.firstName || (raw.email ? raw.email.split('@')[0] : 'Operator');
    
    let initials = '?';
    if (displayName && displayName !== 'Operator') {
        const parts = displayName.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else if (parts.length === 1) {
            initials = parts[0].substring(0, 2).toUpperCase();
        }
    } else if (raw.email) {
        initials = raw.email.substring(0, 2).toUpperCase();
    }

    return {
        id,
        displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        initials,
        avatarUrl: raw.avatarUrl || raw.avatar || raw.avatar_url,
        role: raw.role,
        permissions: raw.permissions || [],
    };
}
