import useSWR from 'swr';
import { featureFlags } from '@/lib/featureFlags';

export function useProviderNodes(scope: string = 'user') {
    const fetcher = async (url: string) => {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('nodl_jwt') || localStorage.getItem('nodlr_session_id')) : null;
        const userId = typeof window !== 'undefined' ? (localStorage.getItem('nodl_user_id') || localStorage.getItem('nodlr_user_id') || localStorage.getItem('user_id')) : null;
        const headers: Record<string, string> = {};
        if (token && token !== 'null' && token !== 'undefined') {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId && userId !== 'null' && userId !== 'undefined') {
            headers['x-user-id'] = userId;
        }

        const res = await fetch(url, { credentials: 'include', headers });

        if (!res.ok) {
            const error = new Error('An error occurred while fetching nodes.');
            // @ts-ignore
            error.info = await res.json();
            // @ts-ignore
            error.status = res.status;
            throw error;
        }

        return res.json();
    };

    const endpoint = scope ? `/api/nodes?scope=${encodeURIComponent(scope)}` : '/api/nodes';

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        fetcher,
        {
            refreshInterval: 10000, // Refresh every 10s
        }
    );

    return {
        nodes: Array.isArray(data) ? data : [],
        loading: isLoading,
        error,
        refresh: mutate,
        mutate
    };
}
