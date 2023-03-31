/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // true 执行两次useEffect
  images: {
    domains: ['img.ddtouxiang.com'],
  },
  sassOptions: {
    additionalData: `@import '@/styles/index.scss';`,
  },
};

module.exports = nextConfig;
