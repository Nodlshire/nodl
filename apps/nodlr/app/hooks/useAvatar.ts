'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useAvatar() {
    const { data, mutate } = useSWR('/api/avatar', fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const avatar = data?.avatar || null;

    const uploadAvatar = async (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const tempReader = new FileReader();
            tempReader.onloadend = (event) => {
                const img = new window.Image();
                img.onload = async () => {
                    // Auto-compress any massive photo down to a 500px avatar
                    const MAX_SIZE = 500;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to lightweight JPEG (80% quality)
                    const base64 = canvas.toDataURL('image/jpeg', 0.8);

                    // Optimistic update
                    mutate({ avatar: base64 }, false);

                    try {
                        const res = await fetch('/api/avatar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ avatar: base64 })
                        });
                        if (!res.ok) throw new Error('Failed to upload');
                        
                        // Final sync
                        mutate({ avatar: base64 });
                        resolve();
                    } catch (e) {
                        // Rollback on error
                        mutate();
                        reject(e);
                    }
                };
                img.src = event.target?.result as string;
            };
            tempReader.onerror = reject;
            tempReader.readAsDataURL(file);
        });
    };

    return {
        avatar,
        uploadAvatar,
        isLoading: !data && !data?.avatar,
    };
}
