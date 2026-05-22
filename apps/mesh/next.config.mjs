/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    serverExternalPackages: ['onnxruntime-node'],
};

export default nextConfig;
