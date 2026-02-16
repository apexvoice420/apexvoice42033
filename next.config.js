/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    serverExternalPackages: ['playwright-core', '@prisma/client', 'prisma'],
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'prisma']
    }
};

module.exports = nextConfig;
