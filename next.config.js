/** @type {import('next').NextConfig} */
// Cache buster: 1
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverComponentsExternalPackages: ['playwright-core']
    }
};

module.exports = nextConfig;
