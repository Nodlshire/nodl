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
                const token = typeof window !== 'undefined' ? localStorage.getItem('nodl_jwt') : null;
                const userId = typeof window !== 'undefined' ? localStorage.getItem('nodl_user_id') : null;

                const headers: Record<string, string> = {};
                if (token && token !== 'null' && token !== 'undefined') {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                if (userId) {
                    headers['X-User-ID'] = userId;
                }

                const res = await fetch('/api/account/me', {
                    credentials: 'include',
                    headers
                });

                if (res.ok) {
                    const data = await res.json();
                    if (!data.error) {
                        setAccount(data);
                    } else {
                        setError(data.error);
                    }
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
