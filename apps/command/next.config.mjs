/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    serverExternalPackages: ['onnxruntime-node'],
    async headers() {
        return [
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
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://127.0.0.1:8080/api/v1/:path*',
            },
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8080/api/v1/:path*',
            },
        ];
    },
};

export default nextConfig;
