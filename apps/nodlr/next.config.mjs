/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: { ignoreDuringBuilds: true },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0" },
                    { key: "CDN-Cache-Control", value: "no-store" },
                    { key: "Cloudflare-CDN-Cache-Control", value: "no-store" },
                    { key: "Surrogate-Control", value: "no-store" },
                    { key: "Pragma", value: "no-cache" },
                    { key: "Expires", value: "0" },
                ],
            },
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:3003" },
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/ws',
                destination: 'http://127.0.0.1:8080/ws',
            },
            {
                source: '/_next/static/chunks/app/dashboard/layout-7dc2105c8cc44854.js',
                destination: '/api/stale-chunk',
            },
            {
                source: '/_next/static/chunks/app/dashboard/page-d36639171acfc3ca.js',
                destination: '/api/stale-chunk',
            },
            {
                source: '/_next/static/chunks/app/layout-fc766acf5e785799.js',
                destination: '/api/stale-chunk',
            },
            {
                source: '/api/v1/:path*',
                destination: 'http://127.0.0.1:8080/api/v1/:path*',
            },
            {
                source: '/api/:path((?!download|stale-chunk).*)',
                destination: 'http://127.0.0.1:8080/api/v1/:path*',
            },
        ];
    },
};

export default nextConfig;
