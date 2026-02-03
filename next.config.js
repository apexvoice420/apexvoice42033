/** @type {import('next').NextConfig} */
// Cache buster: 1
const nextConfig = {
    output: 'standalone',
    serverExternalPackages: ['playwright-core']
};

module.exports = nextConfig;
