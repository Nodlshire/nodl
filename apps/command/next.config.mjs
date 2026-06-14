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
};

export default nextConfig;
