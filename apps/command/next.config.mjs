/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    serverExternalPackages: ['onnxruntime-node'],
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    }
                ],
            },
            {
                source: '/governance',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "frame-src 'self' https://discord.com https://*.discord.com;",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        const backendUrl = process.env.NODLD_API_URL || 'http://127.0.0.1:8080';
        return [
            {
                source: '/ws',
                destination: `${backendUrl}/ws`,
            },
            {
                source: '/api/v1/:path*',
                destination: `${backendUrl}/api/v1/:path*`,
            },
            {
                source: '/api/:path((?!discord).*)',
                destination: `${backendUrl}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;
