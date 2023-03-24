/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.ddtouxiang.com'],
  },
  sassOptions: {
    additionalData: `@import '@/styles/index.scss';`,
  },
};

module.exports = nextConfig;
