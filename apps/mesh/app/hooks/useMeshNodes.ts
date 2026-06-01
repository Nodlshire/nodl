import useSWR from 'swr';

export function useMeshNodes() {
    const fetcher = async (url: string) => {
        const res = await fetch(url);

        if (!res.ok) {
            const error = new Error('An error occurred while fetching nodes.');
            try {
                // @ts-ignore
                error.info = await res.json();
            } catch (e) {}
            // @ts-ignore
            error.status = res.status;
            throw error;
        }

        return res.json();
    };

    const { data, error, isLoading, mutate } = useSWR(
        '/api/v1/nodes',
        fetcher,
        {
            refreshInterval: 10000, // Refresh every 10s
        }
    );

    return {
        nodes: Array.isArray(data) ? data : [],
        loading: isLoading,
        error,
        refresh: mutate
    };
}
