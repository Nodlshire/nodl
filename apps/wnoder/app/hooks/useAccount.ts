import { useState, useEffect } from 'react';

export interface CRMRecord {
    nodlrId?: string;
    email?: string;
    name?: string;
    stripeAccountId?: string;
    status?: string;
    nodes?: string[];
    affiliates?: string[];
    createdAt?: string;
    id?: string;
    displayName?: string;
    role?: string;
    businessName?: string;
    phone?: string;
}

export function useAccount() {
    const [account, setAccount] = useState<CRMRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await fetch('/api/account/me');

                if (res.ok) {
                    const data = await res.json();
                    setAccount(data);
                } else {
                    setError('Failed to fetch account');
                }
            } catch (err) {
                setError('Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, []);

    return { account, loading, error };
}
