/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Enable experimental optimizations
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion', 'chart.js', 'react-chartjs-2'],
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },

    // Compiler optimizations (SWC)
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Headers for caching static assets
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
