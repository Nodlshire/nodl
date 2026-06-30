/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    serverExternalPackages: ['onnxruntime-node'],
    async redirects() {
        return [

            {
                source: '/docs/execution/determinism.md',
                destination: '/docs/execution/determinism',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
